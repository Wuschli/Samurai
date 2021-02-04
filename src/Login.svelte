<script context="module">
    import Matrix, { matrix, isLoggedIn } from "./Matrix.svelte";

    let accessToken = localStorage.getItem("matrixAccessToken");
    let server = localStorage.getItem("matrixHomeServer");
    let userId = localStorage.getItem("matrixUserId");

    loginWithSavedToken();

    async function loginWithSavedToken() {
        if (accessToken != null && server != null) {
            console.log("trying to login with token %s", accessToken);
            if (
                !(await matrix.LoginWithAccessToken(
                    server,
                    userId,
                    accessToken
                ))
            ) {
                console.log("token login failed");
                localStorage.removeItem("matrixAccessToken");
            }
        }
    }
</script>

<script>
    let password = "";
    let userId = "";
    let server = "https://matrix.org";

    async function login() {
        console.log("login as %s with password", userId);
        const accessToken = await matrix.LoginWithPassword(
            server,
            userId,
            password
        );
        password = "";
        // console.log(accessToken);
        if (accessToken) {
            localStorage.setItem("matrixAccessToken", accessToken);
            localStorage.setItem("matrixHomeServer", server);
            localStorage.setItem("matrixUserId", matrix.userId);
        }
    }
</script>

{#if !$isLoggedIn}
    <form on:submit|preventDefault={login}>
        <input type="text" placeholder="User ID" bind:value={userId} />
        <input type="password" placeholder="Password" bind:value={password} />
        <input type="text" placeholder="HomeServer" bind:value={server} />
        <button on:click={login}>Login</button>
    </form>
{/if}

<style lang="scss">
    input {
        margin-bottom: 0.5em;
    }
    button {
        width: 100%;
    }
</style>
