<script>
    import Matrix, { matrix } from "./Matrix.svelte";
    import { afterUpdate } from "svelte";
    import Autoscroll from "./Autoscroll.svelte";
    export let roomId;

    let messages;
    let input;
    let room;

    afterUpdate(() => {
        room = matrix.client.getRoom(roomId);
        if (!room) return;
        messages = room.timeline.filter((m) => m.getContent().body);
    });

    function onMessage(message) {
        if (message.detail.getContent().body) {
            messages = [...messages, message.detail];
        }
    }

    function send() {
        matrix.client.sendMessage(roomId, {
            body: input,
            msgtype: "m.text",
        });
        input = null;
    }
</script>

<Matrix on:message={onMessage} />
<div class="header frame">{roomId}</div>

<div class="messages frame">
    <Autoscroll>
        <div class="message-wrapper">
            {#if messages}
                <ol>
                    {#each messages as message}
                        {#if message.isDecryptionFailure()}
                            <li>
                                Can't decrypt message by {message.getSender()}
                            </li>
                        {:else}
                            <li>
                                <span class="sender"
                                    >{message.getSender()}:</span
                                >
                                <span class="message"
                                    >{message.getContent().body}</span
                                >
                            </li>
                        {/if}
                    {/each}
                </ol>
            {/if}
        </div>
    </Autoscroll>
</div>

{#if room}
    <form on:submit|preventDefault={send}>
        <input type="text" bind:value={input} />
    </form>
{/if}

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
