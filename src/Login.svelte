<script context="module">
    import { matrix, isLoggedIn } from "./matrix_client";

    var accessToken = localStorage.getItem("matrixAccessToken");
    var server = localStorage.getItem("matrixServer");
    var userId = localStorage.getItem("matrixUserId");

    loginWithSavedToken();

    async function loginWithSavedToken() {
        if (accessToken != null && server != null) {
            console.log("trying to login with token %s", accessToken);
            if (!(await matrix.LoginWithAccessToken(server, userId, accessToken))) {
                console.log("token login failed");
                localStorage.removeItem("matrixAccessToken");
            }
        }
    }
</script>

<script>
    let password = "";
    let userId = "";
    export let server;

    async function login() {
        console.log("login as %s with password", userId);
        const accessToken = await matrix.LoginWithPassword(
            server,
            userId,
            password
        );
        password = "";
        // console.log(accessToken);
        localStorage.setItem("matrixAccessToken", accessToken);
        localStorage.setItem("matrixServer", server);
        localStorage.setItem("matrixUserId", matrix.userId);
    }
</script>

{#if !$isLoggedIn}
    <input type="text" bind:value={userId} />
    <input type="password" bind:value={password} />
    <button on:click={login}>Login</button>
{/if}
