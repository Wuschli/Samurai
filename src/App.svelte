<script>
	import Prompt from "./Prompt.svelte";
	import GlobalStyles from "./GlobalStyles.svelte";
	import Contacts from "./Contacts.svelte";
	import GunChat from "./GunChat.svelte";
	import GunUserInfo from "./GunUserInfo.svelte";
</script>

<main>
	<GlobalStyles />
	<GunChat />
	<Prompt />
	<!-- <Contacts /> -->
	<GunUserInfo alias="wuschli" />
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
