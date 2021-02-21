<script>
    import Autoscroll from "./Autoscroll.svelte";
    import Page from "./Page.svelte";
    import bot from "bot-commander";
    import { voice } from "./VoiceChat";
    import { dataConnectionManager } from "./DataConnectionManager";

    let input;
    let output = [];
    let history = [];
    let historyIndex = -1;

    voice.out = print;
    dataConnectionManager.out = print;

    bot.setSend((_, message) => print(message));
    bot.command("call <alias>")
        .description("Call someone identified by their alias")
        .action((a, alias) => {
            voice.CallUser(alias);
        });
    bot.command("peer-call <peer>")
        .description("Call someone identified by their peer")
        .action((_, peer) => {
            voice.CallPeer(peer);
        });
    bot.command("hangup").action(() => {
        voice.HangupCall();
    });
    bot.command("answer").action(() => {
        voice.AnswerCall();
    });

    function parse(input) {
        // console.log(input);
        bot.parse(input);
    }

    function print(...values) {
        // console.log(values);
        for (const value of values) {
            var split = value.toString().split("\n");
            output = [...output, ...split];
        }
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
