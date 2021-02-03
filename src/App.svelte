<script>
	import Chat from "./Chat.svelte";
	import Prompt from "./Prompt.svelte";
</script>

<main>
	<Chat />
	<Prompt />
</main>

<style lang="scss">
	@font-face {
		font-family: Barlow;
		src: url(/fonts/barlow/Barlow-Medium.ttf);
	}
	:global(body) {
		background-color: black;
		color: #ef4f57;
		text-shadow: #ef4f57 0 0 15px;
		text-transform: uppercase;
		font-family: Barlow;
		margin: 0;
		padding: 0;
	}
	main {
		padding: 0;
		max-width: 240px;
		margin: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100%;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	:global(div) {
		flex: 1 1 auto;
		display: flex;
		justify-content: flex-start;
		border: 1px solid #ef4f57;
		padding: 0.5em;
	}

	:global(input, textarea) {
		width: 100%;
		margin: 0;
		color: #ef4f57;
		background: none;
		border: 1px solid #ef4f57;
		border-radius: 0;
		text-transform: uppercase;
		font-family: Barlow;
		&:focus {
			outline: none;
		}
	}
	:global(form) {
		margin: 0;
	}
</style>
