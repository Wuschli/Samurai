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
        background: repeating-linear-gradient(
            #ffffff00 0px,
            #ffffff08 $scanlineHeight - 1px - $scanlineThickness,
            #0000000f $scanlineHeight - $scanlineThickness,
            #00000020 $scanlineHeight
        );
        background-size: 400% 400%;
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
