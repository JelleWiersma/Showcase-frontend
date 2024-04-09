<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		max-height: 100vh;
        overflow: auto;
	}

	@media (min-width: 720px) {
        .app {
			box-shadow: inset 0 0 0.8vw #000000;
			box-sizing: border-box;
            border: 1.5vw solid var(--chestnut);
        }
    }

	main {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
	}
</style>
