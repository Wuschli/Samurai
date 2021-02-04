<script>
	import Chat from "./Chat.svelte";
	import Prompt from "./Prompt.svelte";
</script>

<main>
	<Chat />
	<Prompt />
</main>

<style lang="scss">
	@import "./style/vars";
	@font-face {
		font-family: Barlow;
		src: url(/fonts/barlow/Barlow-Medium.ttf);
	}
	:global(body) {
		background-color: $black;
		@include background-gradient;
		@include color($red);
		@include text;
		margin: 0;
		padding: 0;
	}
	main {
		padding: 0;
		// max-width: 240px;
		margin: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100%;
	}

	// @media (min-width: 640px) {
	// 	main {
	// 		max-width: none;
	// 	}
	// }
	:global(div) {
		flex: 1 1 auto;
		display: flex;
		justify-content: flex-start;
		@include border($red);
		padding: 0.5em;
	}

	:global(input, textarea) {
		width: 100%;
		margin: 0;
		@include color($red);
		background: none;
		@include border($red);
		@include text;
		caret-color: $blue;
	}
	:global(textarea):focus {
		outline: none;
		@include color($blue);
		@include border($blue);
	}
	:global(input):focus {
		outline: none;
		@include color($blue);
		@include border($blue);
	}

	:global(button) {
		@include color($red);
		@include border($red);
		background: none;
		@include text;
		&:focus {
			outline: none;
			@include color($blue);
			@include border($blue);
		}
		&:not(:disabled):active {
			background: none;
			@include color($yellow);
			@include border($yellow);
		}
	}

	:global(form) {
		margin: 0;
	}
</style>
