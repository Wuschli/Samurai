<script>
    import VolumeBar from "./VolumeBar.svelte";
    export let call;
    let stream;

    $: {
        stream = call.RemoteStream;
    }
</script>

<p>{call.RemoteId}</p>
{#if $stream}
    <VolumeBar stream={$stream} />
{/if}
