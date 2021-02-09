<script>
    import { gun } from "./initGun";
    import { v4 as uuidv4 } from "uuid";

    let store = {};

    // Set up a GUN listener to update the value
    gun.get("publicRooms")
        .map()
        .on(function (data, key) {
            if (data) {
                store[key] = data;
            } else {
                // gun.map() can return null (deleted) values for keys
                // if so, this else clause will update your local variable
                delete store[key];
                store = store;
            }
        });

    // Reshape data to convenient variables for the view
    $: publicRooms = Object.entries(store);

    export let selected = null;
    let newRoomName;

    function select(roomId) {
        // console.log(roomId);
        selected = roomId;
    }

    function createRoom() {
        if (!newRoomName) return;
        const newRoom = { name: newRoomName };
        gun.get("publicRooms").set(newRoom, (ack) => {
            if (ack.err) console.error(ack.err);
        });
        newRoomName = null;
    }
</script>

<form on:submit|preventDefault={createRoom}>
    <input type="text" bind:value={newRoomName} />
    <button>Create public Room</button>
</form>
{#if publicRooms}
    {#each publicRooms as [key, room]}
        <p on:click={select(key)} class:selected={selected == key}>
            {room.name}
        </p>
    {/each}
{/if}

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
