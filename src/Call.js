class Call {
    constructor(peerjs, remoteId, out) {
        this.out = out || function () { };
        this._peerjs = peerjs;
        this.Stream = null;

        this.remoteId = remoteId;
        this._audio = null;
        this._mediaConnection = null;
        this._dataConnection = null;

        this._mediaTrackConstraints = {
            video: false,
            audio: {
                echoCancellation: { exact: true },
                noiseSuppression: { exact: true },
                autoGainControl: { ideal: true }
            }
        }

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.AudioContext = new AudioContext();

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
            this.Stream = await navigator.mediaDevices.getUserMedia(this._mediaTrackConstraints);
            this.DataConnection = this._peerjs.connect(this._remoteId);
            this.MediaConnection = this._peerjs.call(this._remoteId, this.Stream);
        }
        catch (err) {
            throw (err);
        }
    }

    async Answer(mediaConnection) {
        try {
            this.Stream = await navigator.mediaDevices.getUserMedia(this._mediaTrackConstraints);
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
        console.log('register media connection callbacks', this.remoteId, conn);

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
        console.log('register data connection callbacks', this.remoteId, conn);

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
        var source = this.AudioContext.createMediaStreamSource(stream);
        const analyser = this.AudioContext.createAnalyser();

        source.connect(analyser);
        analyser.connect(this.AudioContext.destination);
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