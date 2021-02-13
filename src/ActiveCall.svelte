<script>
    import VolumeBar from "./VolumeBar.svelte";
    export let call;
</script>

<p>{call.RemoteId}</p>
<VolumeBar context={call.AudioContext} stream={call.Stream} />
