<script>
    import { pub } from "./initGun";
    import Page from "./Page.svelte";
    import GunLogin from "./GunLogin.svelte";
    import GunRooms from "./GunRooms.svelte";
    import GunRoom from "./GunRoom.svelte";
    let roomId;
</script>

<Page>
    <div class="container frame">
        <GunLogin />
        {#if $pub}
            <div class="rooms frame">
                <GunRooms bind:selected={roomId} />
            </div>
        {/if}

        {#if roomId}
            <!-- <div class="room"> -->
            <GunRoom {roomId} />
            <!-- </div> -->
        {/if}
    </div>
</Page>

<style lang="scss">
    .container {
        height: 100%;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        border: none;
        flex-direction: column;

        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            /* Chrome, Safari and Opera */
            display: none;
        }
    }
    .rooms {
        flex-grow: 0;
        flex-direction: column;
    }
    // div {
    //     flex-direction: column;
    // }
</style>
