<script context="module">
    import { matrix, isLoggedIn } from "./matrix_client";

    var accessToken = localStorage.getItem("matrixAccessToken");
    var userId = localStorage.getItem("matrixUserId");
    var server = localStorage.getItem("matrixServer");

    if (accessToken != null && userId != null) {
        matrix.LoginWithAccessToken(server, userId, accessToken);
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
        localStorage.setItem("matrixUserId", matrix.userId);
        localStorage.setItem("matrixServer", server);
    }
</script>

{#if !$isLoggedIn}
    <input type="text" bind:value={userId} />
    <input type="password" bind:value={password} />
    <button on:click={login}>Login</button>
{/if}
