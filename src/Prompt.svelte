<script>
    import * as bot from "bot-commander";
    import Autoscroll from "./Autoscroll.svelte";
    let input;
    let output = [];
    let history = [];
    let historyIndex = -1;

    bot.setSend((meta, message) => print(message));
    bot.command("list <what>").action((meta, what) => {
        print(what);
    });

    function print(value) {
        var split = value.split("\n");
        output = [...output, ...split];
    }

    function submit() {
        bot.parse(input);
        if (historyIndex >= 0) {
            history.splice(historyIndex, 1);
        }
        history = [input, ...history];
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
<div class="container">
    <div class="output">
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

<style lang="scss">
    .container {
        width: 50%;
    }
    div {
        flex-direction: column;
        // border: none;
    }
    p {
        margin: 0;
    }
    .output {
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1em;
        .output-wrapper {
            min-height: 100%;
            height: fit-content;
            justify-content: flex-end;
            border: none;
        }
    }
</style>
