// import matrixcs from 'matrix-js-sdk';
import { writable } from 'svelte/store';

const sdk = matrixcs;

export const isLoggedIn = writable(false);

class Matrix {

    constructor() {
        this.client = null;
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
            });
            this.startClient();
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
            this.startClient();

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

    startClient() {
        this.client.startClient({ initialSyncLimit: 10 });
        this.client.once('sync', function (state, prevState, res) {
            console.log("Sync done: %s", state); // state will be 'PREPARED' when the client is ready to use  
        });
        this.client.on("event", this.onEvent);
    }

    onEvent(event) {
        console.log(event.getType());
    }
}

export const matrix = new Matrix();