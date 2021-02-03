<script>
import Chat from "./Chat.svelte";
</script>

<main>
	<Chat />
</main>

<style>
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
	}
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
