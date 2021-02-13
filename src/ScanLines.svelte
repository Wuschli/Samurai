<scanlines />

<style lang="scss">
    $scanlineHeight: 8px;
    $scanlineThickness: 1px;
    scanlines {
        pointer-events: none;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5;
        width: 100%;
        height: 100%;
        opacity: 0.28;
        background: repeating-linear-gradient(
            #223 25%,
            #450 25%,
            #410 50%,
            #230 50%,
            #210 75%,
            #200 75%,
            #190
        );
        background-size: 6px 6px;
        animation: scanlines-keys 100s linear infinite;
    }
    @keyframes scanlines-keys {
        0% {
            background-position: 50% 0%;
        }
        50% {
            background-position: 50% 50%;
        }
        100% {
            background-position: 50% 100%;
        }
    }
</style>
