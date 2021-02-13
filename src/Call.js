import { getMicStream, getAudioContext } from './VoiceChat';

class Call {
    constructor(peerjs, remoteId, out) {
        this.out = out || function () { };
        this._peerjs = peerjs;
        this.Stream = null;

        this.RemoteId = remoteId;
        this._audio = null;
        this._mediaConnection = null;
        this._dataConnection = null;

        peerjs.on('connection', function (conn) {
            console.log(conn);
        }.bind(this));
    }

    get MediaConnection() {
        return this._mediaConnection;
    }
    set MediaConnection(conn) {
        this._mediaConnection = conn;
        this._registerMediaConnectionCallbacks(conn);
    }

    get DataConnection() {
        return this._dataConnection;
    }
    set DataConnection(conn) {
        this._dataConnection = conn;
        this._registerDataConnectionCallbacks(conn);
    }

    async Initiate() {
        try {
            console.log("initiate call to", this.RemoteId);
            this.Stream = await getMicStream();
            this.DataConnection = this._peerjs.connect(this.RemoteId);
            this.MediaConnection = this._peerjs.call(this.RemoteId, this.Stream);
        }
        catch (err) {
            throw (err);
        }
    }

    async Answer(mediaConnection) {
        try {
            console.log("accept call from", this.RemoteId);
            this.Stream = await getMicStream();
            this.MediaConnection = mediaConnection;
            mediaConnection.answer(this.Stream);
        }
        catch (err) {
            throw (err);
        }
    }

    HangUp() {
        this.DataConnection?.send({ close: true });
        this.MediaConnection?.close();
        this.Stream.getTracks().forEach(track => track.stop());
    }

    _registerMediaConnectionCallbacks(conn) {
        console.log('register media connection callbacks', this.RemoteId, conn);

        conn.on("stream", function (stream) {
            this.out(conn.peer + ' connected');
            this._setupAudio(conn, stream);
        }.bind(this));

        conn.on("close", function () {
            this.out(conn.peer + ' left the call');
            this._removeCall(conn);
        }.bind(this));

        conn.on("error", function (err) {
            this.out(conn.peer + ' reported an error: ' + err);
            this._removeCall(conn);
        }.bind(this));

    }

    _registerDataConnectionCallbacks(conn) {
        console.log('register data connection callbacks', this.RemoteId, conn);

        conn.on("data", function (data) {
            console.log("received data from", conn.peer, data);
        }.bind(this));
    }

    _setupAudio(connection, stream) {
        console.log('add call ', connection.peer);
        this.audio = new Audio();
        this.audio.muted = true;
        this.audio.srcObject = stream;
        this.audio.addEventListener("canplaythrough", () => {
            this.audio = null;
        });
        var source = getAudioContext().createMediaStreamSource(stream);
        const analyser = getAudioContext().createAnalyser();

        source.connect(analyser);
        analyser.connect(getAudioContext().destination);
    }
}

export function StartCall(peerjs, remoteId, out) {
    try {
        var call = new Call(peerjs, remoteId, out);
        call.Initiate();
        return call;
    }
    catch (err) {
        throw (err);
    }
}

export async function AcceptCall(peerjs, mediaConnection, out) {
    try {
        var call = new Call(peerjs, mediaConnection.peer, out);
        await call.Answer(mediaConnection);
        return call;
    }
    catch (err) {
        throw (err);
    }
}