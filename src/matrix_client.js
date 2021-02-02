import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const sdk = matrixcs;

export const isLoggedIn = writable(false);
export const rooms = writable([]);

class Matrix {

    constructor() {
        this.client = null;

        this.deviceId = localStorage.getItem('matrixDeviceId');
        if (!this.deviceId) {
            this.deviceId = uuidv4();
            localStorage.setItem('matrixDeviceId', this.deviceId);
        }

        this.cryptoStore = new sdk.MemoryCryptoStore(window.localStorage);
        this.webStorageSessionStore = new sdk.WebStorageSessionStore(window.localStorage);
        // this.matrixStore = new sdk.MatrixInMemoryStore();
    }

    get IsLoggedIn() {
        return this.client != null && this.client.isLoggedIn();
    }

    UpdateLogin() {
        isLoggedIn.set(this.IsLoggedIn);
    }

    /**
     * LoginWithAccessToken
     */
    async LoginWithAccessToken(server, userId, accessToken) {
        if (this.isLoggedIn)
            return;
        try {
            this.client = sdk.createClient({
                baseUrl: server,
                userId: userId,
                accessToken: accessToken,
                // store: this.matrixStore,
                sessionStore: this.webStorageSessionStore,
                cryptoStore: this.cryptoStore,
                deviceId: this.deviceId
            });
            await this.startClient();
            this.userId = userId;
            this.accessToken = accessToken;

            console.log('successfully signed in as %s', this.userId);
        }
        catch (e) {
            console.error(e);
        }
        this.UpdateLogin();
    }

    /**
     * LoginWithPassword
     */
    async LoginWithPassword(server, userId, password) {
        if (this.isLoggedIn)
            return;
        try {
            this.client = sdk.createClient(server);
            const data = await this.client.loginWithPassword(userId, password);
            await this.startClient();

            this.accessToken = data.access_token;
            this.userId = data.user_id;
            this.client.credentials.accessToken = this.accessToken;
            this.client.credentials.userId = this.userId;

            console.log('successfully signed in as %s', this.userId);
        }
        catch (e) {
            console.error(e);
        }
        this.UpdateLogin();
        return this.accessToken;

        // client.publicRooms(function (err: any, data: any) {
        //     if (err) {
        //         console.error("error: %s", JSON.stringify(err));
        //         return;
        //     }

        //     console.log("data %s [...]", JSON.stringify(data).substring(0, 100));
        // });
    }

    async startClient() {
        await this.client.initCrypto();
        this.client.startClient({ initialSyncLimit: 10 });
        this.client.once('sync', this.onSync.bind(this));
        this.client.on('event', this.onEvent.bind(this));
    }

    refreshRooms() {
        var r = this.client.getRooms();
        rooms.set(r);
    }

    onEvent(event) {
        // console.log("Event incoming: %s", event.getType(), event);

        switch (event.getType()) {
            case "m.room.name":
                this.refreshRooms();
                break;
        }
    }

    onSync(state, prevState, res) {
        console.log("Sync done: %s", state); // state will be 'PREPARED' when the client is ready to use  
        if (state == 'PREPARED') {
            this.refreshRooms();
        }
    }
}

export const matrix = new Matrix();