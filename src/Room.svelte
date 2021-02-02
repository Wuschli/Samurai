<script>
    import Matrix, { matrix } from "./Matrix.svelte";
    import { afterUpdate } from "svelte";
    export let roomId;

    let messages;
    let input;
    let room;

    afterUpdate(() => {
        room = matrix.client.getRoom(roomId);
        if (!room) return;
        messages = room.timeline;
    });

    function onMessage(message) {
        console.log(message);
        messages = [...messages, message.detail];
    }

    function send() {
        matrix.client.sendMessage(roomId, {
            body: input,
            msgtype: "m.text",
        });
        input = null;
    }
</script>

<Matrix on:message={onMessage} />
<div>{roomId}</div>

{#if messages}
    {#each messages as message}
        {#if message.isDecryptionFailure()}
            <div>
                Can't decrypt message by {message.getSender()}
            </div>
        {:else}
            <div>{message.getSender()}: {message.getContent().body}</div>
        {/if}
    {/each}
{/if}

{#if room}
    <form>
        <input type="text" bind:value={input} />
        <button on:click|preventDefault={send}>Send</button>
    </form>
{/if}
