<script>
    import { rooms } from './Matrix.svelte';

    export let selected = null;

    function select(room) {
        selected = room.roomId;
    }
</script>

{#each $rooms as room}
    <div on:click={select(room)}>
        {room.name}
    </div>
{/each}
