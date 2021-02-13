<script>
    import { onMount } from "svelte";
    import { gun, localAlias } from "./initGun";
    import { calls, incomingCalls } from "./VoiceChat";
    import Page from "./Page.svelte";
    import ActiveCall from "./ActiveCall.svelte";
    import VolumeBar from "./VolumeBar.svelte";

    let displayName;
    let peerId;

    $: {
        // refresh(alias);
        refresh($localAlias);
    }
    function refresh(alias) {
        if (!alias) return;

        const user = gun.get("users/" + alias.toLowerCase());
        displayName = alias;
        user.get("peerId").on((data, key) => {
            // console.log(key, data);
            peerId = data;
        });
    }

    let audioContext;
    let micStream;
    let micPromise;

    $: {
        if ($calls.length != 0) {
            micPromise = getMicStream();
        }
    }

    async function getMicStream() {
        try {
            audioContext = new AudioContext();
            micStream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: {
                    echoCancellation: { exact: true },
                    noiseSuppression: { exact: true },
                    autoGainControl: { ideal: true },
                },
            });
            audioContext.resume();
        } catch (err) {
            console.error(err);
        }
    }
</script>

<Page>
    <div class="container frame">
        {#if $localAlias}
            <div class="frame">
                <p>{displayName}</p>
                {#if $calls.length > 0 || $incomingCalls.length > 0}
                    {#await micPromise then _}
                        <VolumeBar context={audioContext} stream={micStream} />
                    {/await}
                {/if}
                <p>PeerId: {peerId}</p>
            </div>
        {/if}

        {#if $calls.length > 0 || $incomingCalls.length > 0}
            <div class="calls frame">
                <p>Incoming calls</p>
                {#each $incomingCalls as call}
                    <p>{call.peer}</p>
                {/each}
            </div>
            <div class="calls frame">
                <p>Active calls</p>
                {#each $calls as call}
                    <ActiveCall {call} />
                {/each}
            </div>
        {/if}
    </div>
</Page>

<style lang="scss">
    .container {
        flex: 1;
        border: none;
        // height: 100%;
        > div {
            padding: 1em;
            flex: 0 1 auto;
            margin-bottom: 0.5em;
        }
    }
    div {
        flex-direction: column;
    }
</style>
