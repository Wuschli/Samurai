<script>
    import VolumeBar from "./VolumeBar.svelte";
    export let call;
</script>

<p>{call.remoteId}</p>
<VolumeBar context={call.AudioContext} stream={call.Stream} />
