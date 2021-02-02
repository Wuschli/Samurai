<script>
    import { matrix } from "./matrix_client";
    import { afterUpdate } from "svelte";
    export let roomId;

    let messages;

    afterUpdate(() => {
        var room = matrix.client.getRoom(roomId);
        if (!room) return;
        console.log(room.timeline);
        messages = room.timeline;
    });

    // matrix.client.on("Room.timeline", function (event, room, toStartOfTimeline) {
    //     if (toStartOfTimeline) {
    //         return; // don't print paginated results
    //     }
    //     if (event.getType() !== "m.room.message") {
    //         return; // only print messages
    //     }
    //     if (room.roomId != roomId) {
    //         return;
    //     }

    //     console.log(
    //         // the room name will update with m.room.name events automatically
    //         "(%s) %s :: %s",
    //         room.name,
    //         event.getSender(),
    //         event.getContent().body
    //     );
    // });
</script>

<div>{roomId}</div>

{#if messages}
    {#each messages as message}
        <div>{message.event.sender}: {message.getContent().body}</div>
    {/each}
{/if}
