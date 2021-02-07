<script>
	import Chat from "./Chat.svelte";
	import Prompt from "./Prompt.svelte";
	import GlobalStyles from "./GlobalStyles.svelte";
</script>

<main>
	<GlobalStyles />
	<Chat />
	<Prompt />
</main>

<style lang="scss">
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
</style>
