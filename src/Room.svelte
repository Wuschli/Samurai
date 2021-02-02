<script>
    import { matrix } from "./matrix_client";
    import { afterUpdate } from "svelte";
    import {} from "os";
    export let roomId;

    let messages;
    let input;
    let room;

    afterUpdate(() => {
        room = matrix.client.getRoom(roomId);
        if (!room) return;
        messages = room.timeline;
    });

    matrix.client.on(
        "Room.timeline",
        function (event, room, toStartOfTimeline) {
            if (toStartOfTimeline) {
                return; // don't print paginated results
            }
            if (event.getType() !== "m.room.message") {
                return; // only print messages
            }
            if (room.roomId != roomId) {
                return;
            }
            console.log(event);

            messages = room.timeline;
        }
    );

    function send() {
        matrix.client.sendMessage(roomId, {
            body: input,
            msgtype: "m.text",
        });
        input = null;
    }

    function requestKey(message) {
        console.log(message.getType(), message.getSender(), message);
        matrix.client.requestVerification(message.getSender());
    }
</script>

<div>{roomId}</div>

{#if messages}
    {#each messages as message}
        {#if message.isDecryptionFailure()}
            <div on:click={requestKey(message)}>
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
