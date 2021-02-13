import { peer, gun } from "./initGun";
import { array } from './stores';

export const calls = array([]);
export const incomingCalls = array([]);

class VoiceChat {

    out = function () { };

    constructor() {
        peer.subscribe((p) => {
            if (!p) return;
            this._p = p;
            this._p.on("call", this._incomingCall.bind(this));
        }).bind(this);

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this._audioContext = new AudioContext();
    }

    _addCall(call, stream) {
        console.log('add call ', call.peer);
        let a = new Audio();
        a.muted = true;
        a.srcObject = stream;
        a.addEventListener("canplaythrough", () => {
            a = null;
        });
        var source = this._audioContext.createMediaStreamSource(stream);
        const analyser = this._audioContext.createAnalyser();

        source.connect(analyser);
        analyser.connect(this._audioContext.destination);

        calls.push({
            peer: call.peer,
            source: source,
            analyser: analyser,
            call: call,
            audio: a,
        });
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
                var stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                let call = this._p.call(peer, stream);
                this._handleCall(call);
            }
            catch (err) {
                this.out(err);
            }
        }
    }
    CallUser(alias) {
        if (!this._p) {
            print("peerjs is not initialized");
            return;
        }
        gun.get("users")
            .get(alias.toLowerCase())
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
            call.call.close();
        }
        calls.set([]);
        this.out("✔");
    }

    async AnswerCall() {
        if (incomingCalls.length == 0) return;

        try {
            let stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

            for (const call of incomingCalls) {
                this.out('answer call from ' + call.peer);
                this._handleCall(call);
                call.answer(stream);
            }
            incomingCalls.set([]);
            this.out("✔");
        }
        catch (err) {
            this.out(err);
        }
    }

    _incomingCall(c) {
        // console.log(c);
        this.out("incoming call from " + c.peer);
        incomingCalls.push(c);
    }

    _handleCall(mediaConnection) {
        console.log('handle call', mediaConnection);

        mediaConnection.on("stream", function (stream) {
            this.out(mediaConnection.peer + ' connected');
            this._addCall(mediaConnection, stream);
        }.bind(this));

        mediaConnection.on("close", function () {
            this.out(mediaConnection.peer + ' left the call');
            this._removeCall(mediaConnection);
        }.bind(this));

        mediaConnection.on("error", function (err) {
            this.out(mediaConnection.peer + ' reported an error: ' + err);
            this._removeCall(mediaConnection);
        }.bind(this));
    }
}

export const voice = new VoiceChat;