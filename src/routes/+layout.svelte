<script>
	import Cookies from './Cookies.svelte';
import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<Cookies />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100svh;
        overflow: hidden;
	}

	@media (min-width: 720px) {
        .app {
			box-shadow: inset 0 0 0.8vw #000000;
			box-sizing: border-box;
            border: 2.3svh solid var(--color-theme-2);
        }
    }

	main {
		width: 100%;
		min-height: 100%;
		overflow: auto;
	}
</style>
