<page>
    <slot />
</page>

<style lang="scss">
    page {
        flex: 1 0 100%;
        padding: 0;
        width: 100vw;
        margin: 0;
        // display: flex;
        // flex-direction: row;
        // justify-content: space-between;
        height: 100%;
        scroll-snap-align: start;
    }

    @media (min-width: 720px) {
        page {
            max-width: 50%;
        }
    }

    @media (min-width: 900px) {
        page {
            max-width: 33.33333%;
        }
    }
</style>
