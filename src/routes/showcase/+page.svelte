<script>
    import Help from "./help.svelte";
	import { hideNavigation } from "$lib/store";
    import { onMount, onDestroy } from "svelte";
    
	onMount(() => {
        hideNavigation.set(true);
    });

    onDestroy(() => {
        hideNavigation.set(false);
    });
	
	/**
     * @type {Help}
     */
    let help;
</script>

<svelte:head>
    <title>Zweeds Pesten</title>
</svelte:head>

<Help bind:this={help}></Help>

<button on:click={() => help.open()}>Open help</button>