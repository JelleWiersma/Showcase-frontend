<script>
    import Menu from "./Components/menu.svelte";
	import { hideNavigation } from "$lib/store";
    import { onMount } from "svelte";
    import SmallScreen from "./Components/smallScreen.svelte";

    let innerWidth = 0;
    let isSmallScreen = false;

    $: {
        isSmallScreen = innerWidth < 1200;
    }

	onMount(() => {
        hideNavigation.set(false);
    });
</script>

<svelte:head>
    <title>Zweeds Pesten</title>
</svelte:head>

<svelte:window bind:innerWidth={innerWidth}></svelte:window>

{#if isSmallScreen}
    <SmallScreen></SmallScreen>
{:else}
    <Menu></Menu>
{/if}

