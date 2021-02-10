<script>
    import Page from "./Page.svelte";
    import { gun } from "./initGun";

    export let alias;

    let displayName;
    let peerId;

    $: {
        refresh(alias);
    }
    function refresh(alias) {
        if (!alias) return;

        const user = gun.get("users/" + alias);
        displayName = alias;
        user.get("peerId").on((data, key) => {
            console.log(key, data);
            peerId = data;
        });
    }
</script>

<Page>
    <div class="container frame">
        <div class="frame">
            <p>{displayName}</p>
            <p>PeerId: {peerId}</p>
        </div>
    </div>
</Page>

<style lang="scss">
    .container {
        flex: 1;
        border: none;
        height: 100%;
        > div {
            padding: 1em;
            flex: 0 1 auto;
        }
    }
    div {
        flex-direction: column;
    }
</style>
