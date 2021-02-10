<script>
    import { gun } from "./initGun";
    import Autoscroll from "./Autoscroll.svelte";
    import GunChatMessage from "./GunChatMessage.svelte";
    export let roomId;

    let store = {};
    let input;
    let room;

    $: {
        roomId;
        room?.off();
        if (roomId) {
            // roomId, console.log(roomId);
            room = gun.get("publicRooms/" + roomId + "/messages");
            // console.log(room);
            store = {};

            room.map().on((data, key) => {
                if (data) {
                    store[key] = data;
                } else {
                    // gun.map() can return null (deleted) values for keys
                    // if so, this else clause will update your local variable
                    delete store[key];
                    store = store;
                }
            });
        }
    }

    function send() {
        if (!room || !gun.user().is) return;
        var newMessage = {
            author: gun.user().is.alias,
            body: input,
        };
        console.log("send", newMessage);
        room.set(newMessage, (ack) => {
            if (ack.err) console.error(ack.err);
            else console.log("sent", newMessage);
        });
        input = null;
    }
    $: messages = Object.entries(store);
</script>

<div class="header frame">{roomId}</div>

<div class="messages frame">
    <Autoscroll>
        <div class="message-wrapper">
            {#if messages}
                <ol>
                    {#each messages as [, message]}
                        <GunChatMessage {message} />
                    {/each}
                </ol>
            {/if}
        </div>
    </Autoscroll>
</div>

<form on:submit|preventDefault={send}>
    <input type="text" bind:value={input} inputmode="full-width-latin" />
</form>

<style lang="scss">
    @import "./style/vars";
    .header {
        flex: 0 0 auto;
        margin: 0.5em 0;
    }
    .messages {
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1em;
        margin-bottom: 0.5em;
        .message-wrapper {
            min-height: 100%;
            height: fit-content;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            border: none;
            margin: 0;
            padding: 0;

            > ol {
                margin: 0;
                padding: 0;
                list-style-type: none;
                height: fit-content;
            }
        }
    }
</style>
