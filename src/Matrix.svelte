<script context="module">
    import { writable } from "svelte/store";
    // import { v4 as uuidv4 } from "uuid";

    const sdk = matrixcs;
    console.log(sdk.MatrixClient);

    export const isLoggedIn = writable(false);
    export const rooms = writable([]);

    class Matrix {
        constructor() {
            this.client = null;

            this.deviceId = localStorage.getItem("matrixDeviceId");
            // if (!this.deviceId) {
            //     this.deviceId = uuidv4();
            //     localStorage.setItem("matrixDeviceId", this.deviceId);
            // }

            // console.log(sdk);

            this.cryptoStore = new sdk.IndexedDBCryptoStore(
                window.indexedDB,
                "matrix_crypto"
            );
            this.sessionStore = new sdk.WebStorageSessionStore(
                window.localStorage
            );
            this.matrixStore = new sdk.IndexedDBStore({
                indexedDB: window.indexedDB,
                dbName: "matrix_store",
            });
        }

        async IsLoggedIn() {
            return this.client != null && (await this.client.isLoggedIn());
        }

        async UpdateLogin() {
            isLoggedIn.set(await this.IsLoggedIn());
        }

        /**
         * LoginWithAccessToken
         */
        async LoginWithAccessToken(server, userId, accessToken) {
            if (await this.IsLoggedIn()) {
                console.warn("already logged in");
                return;
            }
            console.log("login using access token as ", userId);

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
                    verificationMethods: [
                        "m.sas.v1",
                        "m.qr_code.show.v1",
                        "m.reciprocate.v1",
                    ],
                });
                await this.startClient();
                this.accessToken = accessToken;
                this.userId = this.client.credentials.userId;

                console.log("successfully signed in as %s", this.userId);
            } catch (e) {
                console.error(e);
                return;
            }
            await this.UpdateLogin();
            return this.accessToken;
        }

        /**
         * LoginWithPassword
         */
        async LoginWithPassword(server, userId, password) {
            if (await this.IsLoggedIn()) {
                console.warn("already logged in");
                return;
            }
            console.log("login using password");

            try {
                await this.matrixStore.startup(); // load from indexed db
                const client = sdk.createClient({
                    baseUrl: server,
                    userId: userId,
                    sessionStore: this.sessionStore,
                    cryptoStore: this.cryptoStore,
                    store: this.matrixStore,
                    deviceId: this.deviceId,
                    timelineSupport: true,
                });
                const data = await client.loginWithPassword(userId, password);
                console.log(data);

                if (data && data.access_token) {
                    this.deviceId = data.device_id;
                    this.userId = data.user_id;
                    localStorage.setItem("matrixDeviceId", this.deviceId);
                    return await this.LoginWithAccessToken(
                        server,
                        this.userId,
                        data.access_token
                    );
                }
            } catch (e) {
                console.error(e);
            }
            await this.UpdateLogin();
            return this.accessToken;
        }

        async startClient() {
            await this.client.initCrypto();
            await this.client.startClient({ initialSyncLimit: 10 });
            this.client.once("sync", this.onSync.bind(this));

            this.client.on("event", this.onEvent.bind(this));
            this.client.on("Event.decrypted", (event) => {
                console.log(
                    "decrypted an event of type",
                    event.getType(),
                    event
                );
            });
            this.client.on("crypto.roomKeyRequest", (event) => {
                event.share();
            });
            this.client.on(
                "RoomMember.membership",
                function (event, member) {
                    this.refreshRooms();
                }.bind(this)
            );
        }

        refreshRooms() {
            var r = this.client.getRooms();
            rooms.set(r);
        }

        onSync(state, prevState, res) {
            console.log("Sync done: %s", state); // state will be 'PREPARED' when the client is ready to use
            if (state == "PREPARED") {
                this.client.setGlobalErrorOnUnknownDevices(false);
                this.refreshRooms();
                console.log(this.client);
            }
        }

        onEvent(event) {
            // if (event.getType().startsWith("m.room.")) return;
            console.log("Event incoming: %s", event.getType(), event);

            switch (event.getType()) {
                case "m.key.verification.request":
                    break;

                default:
                    break;
            }
        }
    }

    export const matrix = new Matrix();
</script>

<script>
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    onMount(() => {
        matrix.client.on("event", (event) => {
            switch (event.getType()) {
                case "m.room.message":
                    dispatch("message", event);
                    break;
                default:
                    break;
            }
        });
        matrix.client.on("Event.decrypted", (event) => {
            // console.log("decrypted an event of type", event.getType(), event);
            if (event.getType() == "m.room.message") {
                dispatch("message", event);
            }
        });
    });
    onDestroy(() => {
        matrix.client.off("event");
        matrix.client.off("Event.decrypted");
    });
</script>
