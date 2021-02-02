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

        console.log(sdk);

        // this.cryptoStore = new sdk.MemoryCryptoStore(window.localStorage);
        this.cryptoStore = new sdk.IndexedDBCryptoStore(window.indexedDB, "matrix_crypto");
        this.sessionStore = new sdk.WebStorageSessionStore(window.localStorage);
        this.matrixStore = new sdk.IndexedDBStore({
            indexedDB: window.indexedDB,
            dbName: "matrix_store"
        });
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
            await this.matrixStore.startup(); // load from indexed db
            this.client = sdk.createClient({
                baseUrl: server,
                userId: userId,
                accessToken: accessToken,
                sessionStore: this.sessionStore,
                store: this.matrixStore,
                cryptoStore: this.cryptoStore,
                deviceId: this.deviceId,
                timelineSupport: true,
            });
            await this.startClient();
            this.accessToken = this.client.credentials.accessToken;
            this.userId = this.client.credentials.userId;

            console.log('successfully signed in as %s', this.userId);
        }
        catch (e) {
            console.error(e);
            return false;
        }
        this.UpdateLogin();
        return true;
    }

    /**
     * LoginWithPassword
     */
    async LoginWithPassword(server, userId, password) {
        if (this.isLoggedIn)
            return;
        try {
            await this.matrixStore.startup(); // load from indexed db
            this.client = sdk.createClient({
                baseUrl: server,
                userId: userId,
                sessionStore: this.sessionStore,
                cryptoStore: this.cryptoStore,
                store: this.matrixStore,
                deviceId: this.deviceId,
                timelineSupport: true,
            });
            const data = await this.client.loginWithPassword(userId, password);
            await this.startClient();

            console.log(data);

            this.accessToken = data.access_token;
            this.userId = data.user_id;
            this.deviceId = data.device_id;
            this.client.credentials.accessToken = this.accessToken;
            this.client.credentials.userId = this.userId;
            
            localStorage.setItem('matrixDeviceId', this.deviceId);

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
        var deviceId = await this.client.getDeviceId();
        console.log('Device ID: %s', deviceId);
        await this.client.initCrypto();
        await this.client.startClient({ initialSyncLimit: 10 });
        this.client.once('sync', this.onSync.bind(this));
        this.client.on('event', this.onEvent.bind(this));

        this.client.on('Event.decrypted', (event) => {
            console.log('decrypted an event of type', event.getType(), event);
        });

        this.client.on('crypto.roomKeyRequest', (event) => {
            event.share();
        });
    }

    refreshRooms() {
        var r = this.client.getRooms();
        rooms.set(r);
    }

    onEvent(event) {
        // console.log("Event incoming: %s", event.getType(), event);

        if (event.isDecryptionFailure()) {
            console.warning('failed to decrypt', event);
            return;
        }

        switch (event.getType()) {
            case "m.room.name":
                this.client.setGlobalErrorOnUnknownDevices(false);
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