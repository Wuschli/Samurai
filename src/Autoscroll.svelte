<script>
    import { afterUpdate } from "svelte";

    let div;

    afterUpdate(() => {
        if (div.scrollHeight > div.clientHeight) {
            div.scrollTo(0, div.scrollHeight - div.clientHeight);
        }
    });
</script>

<div class="scrollable" bind:this={div}>
    <slot />
</div>

<style lang="scss">
    .scrollable {
        overflow-y: auto;
        padding: 0;
        border: none;
        
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            /* Chrome, Safari and Opera */
            display: none;
        }
    }
</style>
