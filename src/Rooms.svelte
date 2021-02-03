<script>
    import { rooms } from './Matrix.svelte';

    export let selected = null;

    function select(room) {
        selected = room.roomId;
    }
</script>

{#each $rooms as room}
    <p on:click={select(room)}>
        {room.name}
    </p>
{/each}
