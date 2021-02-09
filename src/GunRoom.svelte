<script>
    import { gun } from "./initGun";
    import { afterUpdate } from "svelte";
    import Autoscroll from "./Autoscroll.svelte";
    export let roomId;

    let store = {};
    let input;
    // let room;
    let listener;

    afterUpdate(() => {
        if (listener) {
            listener.off();
            listener = null;
        }
        store = {};

        gun.get("publicRooms/" + roomId + "/messages")
            .map()
            .on((data, key, msg, eve) => {
                listener = eve;
                // console.log(key, data);
                if (data) {
                    store[key] = data;
                } else {
                    // gun.map() can return null (deleted) values for keys
                    // if so, this else clause will update your local variable
                    delete store[key];
                    store = store;
                }
            });
    });

    // function onMessage(message) {
    //     if (message.detail.getContent().body) {
    //         store = [...store, message.detail];
    //     }
    // }

    function send() {
        gun.get("publicRooms/" + roomId + "/messages").set({
            author: gun.user().is.alias,
            body: input,
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
                    {#each messages as [key, message]}
                        <li>
                            <span class="sender">{message.author}:</span>
                            <span class="message">
                                {message.body}
                            </span>
                        </li>
                    {/each}
                </ol>
            {/if}
        </div>
    </Autoscroll>
</div>

<form on:submit|preventDefault={send}>
    <input type="text" bind:value={input} />
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
                > li {
                    margin: 1.2em 0;
                    > .sender {
                        @include color($blue);
                    }
                    > .message {
                        @include color($white);
                    }
                }
            }
        }
    }
</style>
