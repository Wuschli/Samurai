<script>
    import { rooms } from "./Matrix.svelte";

    export let selected = null;

    function select(room) {
        selected = room.roomId;
    }
</script>

{#each $rooms as room}
    <p on:click={select(room)} class:selected={selected === room.roomId}>
        {room.name}
    </p>
{/each}

<style lang="scss">
    @import "./style/vars";
    p {
        margin: 0.5em 0;
        @include color($yellow);
    }
    .selected {
        @include color($white);
    }
</style>
