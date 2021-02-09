<script context="module">
    import { gun, pub } from "./initGun";
    let user = gun.user().recall({ sessionStorage: true }, (ack) => {
        if (user.is) {
            pub.set(user.is.pub);
        }
        console.log("recall done", user.is);
    });
</script>

<script>
    let alias = "";
    let password = "";
    let err = "";

    function _login(alias, password) {
        let user = gun.user();
        user.user().auth(alias, password, (ack) => {
            console.log(ack);
            err = ack.err;
            pub.set(user.is?.pub);
            if (err == "User is already being created or authenticated!")
                user.leave();
        });
    }

    async function login() {
        console.log("login as %s with password", alias);
        _login(alias, password);
        password = "";
    }
    function logout() {
        gun.user().leave();
        pub.set(null);
    }
    async function register() {
        console.log("register as %s with password", alias);
        let user = gun.user();
        user.create(alias, password, (ack) => {
            console.log(ack);
            err = ack.err;
            if (!ack.err) {
                _login(alias, password);
            }
            password = "";
        });
    }
</script>

{#if !$pub}
    <form on:submit|preventDefault={login}>
        <input type="text" placeholder="User ID" bind:value={alias} />
        <input type="password" placeholder="Password" bind:value={password} />
        <button>Login</button>
        <button on:click|preventDefault={register}>Register</button>
    </form>
{:else}
    <button on:click={logout}>Logout</button>
{/if}
{#if err}
    <p>Error: {err}</p>
{/if}

<style lang="scss">
    input {
        margin-bottom: 0.5em;
    }
    button {
        width: 100%;
    }
</style>
