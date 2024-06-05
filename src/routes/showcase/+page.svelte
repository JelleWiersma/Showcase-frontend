<script>
    import Help from "./Components/help.svelte";
	import { hideNavigation } from "$lib/store";
    import { onMount, onDestroy } from "svelte";
    import SmallScreen from "./Components/smallScreen.svelte";

    let innerWidth = 0;
    let isLargeScreen = true;
    
    $: {
        isLargeScreen = innerWidth > 1200;
        if (isLargeScreen) {
            hideNavigation.set(true);
        } else {
            hideNavigation.set(false);
        }
    }

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
<svelte:window bind:innerWidth={innerWidth}></svelte:window>

{#if isLargeScreen}
    <Help bind:this={help}></Help>

    <button on:click={() => help.open()}>Open help</button>
{:else}
    <SmallScreen></SmallScreen>
{/if}

