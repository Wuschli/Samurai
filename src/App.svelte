<script>
	import Chat from "./Chat.svelte";
	import Prompt from "./Prompt.svelte";
	import GlobalStyles from "./GlobalStyles.svelte";
</script>

<main>
	<GlobalStyles />
	<page>
		<Chat />
	</page>
	<page>
		<Prompt />
	</page>
	<page>
		<Prompt />
	</page>
</main>

<style lang="scss">
	main {
		padding: 0;
		// max-width: 240px;
		margin: 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 100%;
		// width: 100%;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
	}
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

	@media (min-width: 750px) {
		page {
			max-width: 33.33333%;
		}
	}
</style>
