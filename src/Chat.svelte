<script>
    import Login from "./Login.svelte";
    import Room from "./Room.svelte";
    import Rooms from "./Rooms.svelte";
    let server = "https://matrix.org";
    let roomId;
</script>

<Login {server} />
<Rooms bind:selected={roomId} />

{#if roomId}
    <Room {roomId} />
{/if}
