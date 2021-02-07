<script>
	import Chat from "./Chat.svelte";
	import Prompt from "./Prompt.svelte";
	import GlobalStyles from "./GlobalStyles.svelte";
	import Contacts from "./Contacts.svelte";
	import GunChat from "./GunChat.svelte";
</script>

<main>
	<GlobalStyles />
	<Chat />
	<Prompt />
	<GunChat />
	<Contacts />
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
</style>
