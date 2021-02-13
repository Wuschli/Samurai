<script>
    import { onMount, onDestroy } from "svelte";
    import SoundMeter from "./soundMeter";

    export let context;
    export let stream;
    export let value = 0;

    let soundMeter;
    let meterRefresh;

    $: {
        if (soundMeter) {
            soundMeter.stop();
            soundMeter = null;
        }
        if (meterRefresh) {
            clearInterval(meterRefresh);
            meterRefresh = null;
        }
        if (stream) {
            soundMeter = new SoundMeter(context);
            soundMeter.connectToSource(stream, function (e) {
                if (e) {
                    console.error(e);
                    return;
                }
                meterRefresh = setInterval(() => {
                    value = soundMeter.instant.toFixed(2) * 100;
                    // console.log(value);
                }, 50);
            });
        }
    }
</script>

<div class="volume-bar">
    <div class="volume-value" style="width:{value}%;" />
</div>

<style lang="scss">
    @import "./style/vars";
    .volume-bar {
        width: 100%;
        height: 0.5em;
        @include border($yellow);
        > .volume-value {
            background-color: $yellow;
            height: 100%;
        }
    }
</style>
