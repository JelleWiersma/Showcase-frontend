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

	@media (min-width: 768px) {
        .app {
			box-shadow: inset 0 0 0.8vw #000000;
			box-sizing: border-box;
            border: 1.5vw solid var(--chestnut);
        }
    }

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
