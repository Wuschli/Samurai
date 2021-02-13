import { peer } from "./initGun";
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

    _addCall(call, stream, peerId) {
        console.log('add call ', peerId);
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

        console.log(source);

        calls.push({
            peer: call.peer,
            source: source,
            analyser: analyser,
            call: call,
            audio: a,
        });
        // console.log(streams);
    }

    _removeCall(call) {
        console.log("remove call", call, calls);
        var i = 0;
        while (i < this._calls.length) {
            if (this._calls[i].peer == call.peer) {
                this._calls[i].audio?.remove();
                this._calls.splice(i, 1);
            } else {
                ++i;
            }
        }
        this._calls = this._calls;
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
                call.on("stream", function (s) {
                    this.out(peer + ' answered the call');
                    this._addCall(call, s, peer);
                }.bind(this));

                call.on("close", function () {
                    this.out(peer + ' left the call');
                    this._removeCall(call);
                }.bind(this));
            }
            catch (err) {
                this.out(err);
            }
        }
    }

    HangupCall() {
        for (const call of calls) {
            console.log(call);
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
                call.answer(stream);
                call.on("stream", function (s) {
                    this._addCall(call, s);
                }.bind(this));
                call.on("close", function () {
                    this._removeCall(call);
                }.bind(this));
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
}

export const voice = new VoiceChat;