<script>
    import { gun, peer } from "./initGun";
    export let message;
    let author;
    let peerId;
    $: {
        message;
        author = message.author;
        peerId = null;
        gun.get("users")
            .get(message.author)
            .get("peerId")
            .on((data) => {
                peerId = data;
            });
    }

    function connect(peerId) {
        if (!peerId) return;
        const conn = peer.connect(peerId);
        conn.on("open", function () {
            // Receive messages
            conn.on("data", function (data) {
                console.log("Received", data);
            });

            // Send messages
            conn.send("Hello!");
        });
    }
</script>

<li>
    <span class="sender">{author}:</span>
    {#if peerId}
        <span class="peer-id" on:click={connect(peerId)}>[{peerId}]</span>
    {/if}
    <span class="message">
        {message.body}
    </span>
</li>

<style lang="scss">
    @import "./style/vars";
    li {
        margin: 1.2em 0;
        > .sender {
            @include color($blue);
        }
        > .message {
            @include color($white);
        }
    }
</style>
