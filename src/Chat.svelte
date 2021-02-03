<script>
    import Login from "./Login.svelte";
    import Room from "./Room.svelte";
    import Rooms from "./Rooms.svelte";
    let server = "https://matrix.org";
    let roomId;
</script>

<div class="container">
    <Login {server} />
    <div class="rooms">
        <Rooms bind:selected={roomId} />
    </div>

    {#if roomId}
        <!-- <div class="room"> -->
        <Room {roomId} />
        <!-- </div> -->
    {/if}
</div>

<style lang="scss">
    .container {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        border: none;

        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            /* Chrome, Safari and Opera */
            display: none;
        }
    }
    .rooms {
        flex-grow: 0;
    }
    div {
        flex-direction: column;
    }
</style>
