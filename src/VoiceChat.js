import { peer, gun } from "./initGun";
import { array } from './stores';
import { StartCall, AcceptCall } from './Call';

export const calls = array([]);
export const incomingCalls = array([]);


window.AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioContext = new AudioContext();
let micStream;

export async function getMicStream() {
    if (micStream) return micStream;
    try {
        micStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                echoCancellation: { exact: true },
                noiseSuppression: { exact: true },
                autoGainControl: { ideal: true },
            },
        });
        audioContext.resume();
    } catch (err) {
        console.error(err);
    }
    return micStream;
}

class VoiceChat {

    out = function () { };

    constructor() {
        peer.subscribe(function (p) {
            if (!p) return;
            this._p = p;
            this._p.on("call", function (c) {
                console.log(c);
                this.out("incoming call from " + c.peer);
                incomingCalls.push(c);
            }.bind(this));
        }.bind(this));
    }

    _removeCall(call) {
        console.log("remove call", call.peer);
        calls.removeIf((c, i) => {
            if (c.peer == call.peer) {
                console.log('remove', c.peer);
                c.audio?.remove();
            }
        });
    }

    async CallPeer(peer) {
        if (!this._p) {
            this.out("peerjs is not initialized");
            return;
        }
        if (peer) {
            this.out("calling " + peer + "...");
            try {
                var call = StartCall(this._p, peer, this.out);
                calls.push(call);
            }
            catch (err) {
                this.out(err);
            }
        }
    }

    CallUser(alias) {
        alias = alias.toLowerCase();
        if (!this._p) {
            print("peerjs is not initialized");
            return;
        }
        gun.get("users")
            .get(alias)
            .get("peerId")
            .once((peerId, key) => {
                if (peerId) {
                    this.out("calling " + alias + " at " + peerId + "...");
                    this.CallPeer(peerId);
                }
            });
    }

    HangupCall() {
        for (const call of calls) {
            console.log(call);
            call.HangUp();
        }
        calls.set([]);
        this.out("✔");
    }

    async AnswerCall() {
        if (incomingCalls.length == 0) return;

        try {
            for (const call of incomingCalls) {
                this.out('answer call from ' + call.peer);
                await calls.push(await AcceptCall(this._p, call, this.out));
            }
            incomingCalls.set([]);
            this.out("✔");
        }
        catch (err) {
            this.out(err);
        }
    }
}

export const voice = new VoiceChat;