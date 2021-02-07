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
	:global(.frame) {
		flex: 1 1 auto;
		display: flex;
		@include border($red);
		padding: 0.5em;
	}

	:global(input, textarea) {
		width: 100%;
		margin: 0;
		caret-color: $blue;
		background: none;
		@include color($red);
		@include border($red);
		@include text;
	}
	:global(textarea) {
		&:focus {
			outline: none;
			@include color($blue);
			@include border($blue);
		}
		&::placeholder {
			@include color($yellow);
		}
	}
	:global(input) {
		&:focus {
			outline: none;
			@include color($blue);
			@include border($blue);
		}
		&::placeholder {
			@include color($yellow);
		}
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
