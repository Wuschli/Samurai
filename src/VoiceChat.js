import { peer, gun } from "./initGun";
import { array } from './stores';
import { StartCall, AcceptCall } from './Call';

export const calls = array([]);
export const incomingCalls = array([]);

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
            call.Hangup();
        }
        calls.set([]);
        this.out("✔");
    }

    async AnswerCall() {
        if (incomingCalls.length == 0) return;

        try {
            for (const call of incomingCalls) {
                await calls.push(AcceptCall(this._p, call, this.out));
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