import { peer } from "./initGun";

class DataConnectionManager {

    constructor() {
        this._connections = {};
        this.out = function () { };
        peer.subscribe(function (p) {
            if (!p) return;
            this._p = p;
            this._p.on("connection", this._onConnect.bind(this));
        }.bind(this));

    }

    async Connect(peerId) {
        console.log(peerId);
        let conn = this._connections[peerId];
        if (!conn)
            conn = this._p.connect(peerId);
        await this.waitForOpen(conn)

        console.log(conn);
        return conn;
    }

    async _onConnect(conn) {
        console.log(conn);
        this.out("incoming connection from " + conn.peer);

        if (this._connections[conn.peer]) {
            console.warn("connection already exists:", conn.peer);
            return;
        }

        await this.waitForOpen(conn);

        this._connections[conn.peer] = conn;
    }

    async waitForOpen(conn) {
        return new Promise(function (resolve) {
            if (conn.open) {
                resolve();
            }
            else {
                conn.on('open', function () {
                    resolve();
                });
            }
        });
    }
}

export const dataConnectionManager = new DataConnectionManager();