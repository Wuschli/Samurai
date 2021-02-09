<script>
    // import { contacts } from "./gunStores";
    import Page from "./Page.svelte";
    // let store = {};

    // gun.get("contacts")
    //     .map()
    //     .on((data, key) => {
    //         if (data) {
    //             store[key] = data;
    //         } else {
    //             delete store[key];
    //             store = store;
    //         }
    //     });

    // $: contacts = Object.entries(store).sort((a, b) => a[1].done);
</script>

<Page>
    <div class="container frame">
        <!-- {#each Object.entries($contacts) as [key, todo]}
            <div id={key}>
                {todo.title}
                {todo.done ? "😺" : "😾"}
            </div>
        {/each} -->
    </div>
</Page>

<style lang="scss">
    .container {
        height: 100%;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        border: none;
        flex-direction: column;

        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            /* Chrome, Safari and Opera */
            display: none;
        }
    }
</style>
