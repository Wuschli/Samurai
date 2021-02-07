<script>
    import Autoscroll from "./Autoscroll.svelte";
    import { matrix } from "./Matrix.svelte";
    import Page from "./Page.svelte";

    let input;
    let output = [];
    let history = [];
    let historyIndex = -1;

    async function parse(input) {
        // yargs.parse(input);
        // bot.parse(input);
        switch (input) {
            case "list rooms":
                var rooms = await matrix.client.getRooms();
                rooms.forEach((room) => {
                    // console.log(room);
                    print(`${room.name.padEnd(30, " ")} [${room.roomId}]`);
                });
                break;

            default:
                break;
        }
    }

    function print(value) {
        // console.log(value);
        var split = value.toString().split("\n");
        output = [...output, ...split];
    }

    function submit() {
        if (!input) return;
        var i = input.toLowerCase();
        print(">" + i);
        parse(i);
        if (historyIndex >= 0) {
            history.splice(historyIndex, 1);
        }
        history = [i, ...history];
        historyIndex = -1;
        input = "";
    }

    function handleKeydown(event) {
        var key = event.key;
        if (key == "Escape") {
            input = "";
            return;
        }
        if (history.length == 0) return;
        if (key == "ArrowUp" && historyIndex < history.length - 1) {
            input = history[++historyIndex];
            if (historyIndex >= history.length)
                historyIndex = history.length - 1;
            return;
        }
        if (key == "ArrowDown") {
            input = history[--historyIndex];
            if (historyIndex < 0) historyIndex = -1;
            return;
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />
<Page>
    <div class="container frame">
        <div class="output frame">
            <Autoscroll>
                <div class="output-wrapper">
                    {#each output as line}
                        <p>{line}</p>
                    {/each}
                </div>
            </Autoscroll>
        </div>
        <form on:submit|preventDefault={submit}>
            <input bind:value={input} />
        </form>
    </div>
</Page>

<style lang="scss">
    .container {
        flex: 1;
        border: none;
        height: 100%;
        .output {
            flex: 1 1 auto;
            overflow-y: auto;
            overflow-x: hidden;
            justify-content: flex-end;
            padding: 1em;
            margin-bottom: 0.5em;
            .output-wrapper {
                min-height: 100%;
                height: fit-content;
                justify-content: flex-end;
                border: none;
                > p {
                    white-space: pre;
                    font-family: monospace;
                    margin: 0;
                }
            }
        }
        input {
            font-family: monospace;
        }
    }
    div {
        flex-direction: column;
    }
</style>
