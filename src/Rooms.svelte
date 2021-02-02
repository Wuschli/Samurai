<script>
    import { rooms } from "./matrix_client";

    export let selected;

    function select(room) {
        selected = room.roomId;
    }
</script>

{#each $rooms as room}
    <div on:click={select(room)}>
        {room.name}
    </div>
{/each}
