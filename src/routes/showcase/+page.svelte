<script>
    import Menu from "./Components/menu.svelte";
	import { hideNavigation } from "$lib/store";
    import { onMount } from "svelte";
    import SmallScreen from "./Components/smallScreen.svelte";
    import { page } from '$app/stores';
    
    let verify;
    let innerWidth = 0;
    let isSmallScreen = false;
    let showEmailVerifiedMessage = false;
    let showEmailNotVerifiedMessage = false;

    $: {
        verify = $page.url.searchParams.get('verify');
        if (verify === 'success') {
            showEmailVerifiedMessage = true;
        } else if (verify === 'failed') {
            showEmailNotVerifiedMessage = true;
        } else {
            showEmailVerifiedMessage = false;
            showEmailNotVerifiedMessage = false;
        }
    }

	onMount(() => {
        hideNavigation.set(false);
        isSmallScreen = innerWidth < 1200;
    });
</script>

<svelte:head>
    <title>Zweeds Pesten</title>
</svelte:head>

<svelte:window bind:innerWidth={innerWidth}></svelte:window>

{#if showEmailVerifiedMessage}
    <div class="confirmation-message">
        Je email is geverifieerd. Je kan nu inloggen.
        <button class="close-button" on:click={() => { showEmailVerifiedMessage = false }}>X</button>
    </div>
{:else if showEmailNotVerifiedMessage}
    <div class="failure-message">
        Je email kon niet geverifieerd worden. Probeer het later opnieuw.
        <button class="close-button" on:click={() => { showEmailNotVerifiedMessage = false }}>X</button>
    </div>
{/if}

{#if !isSmallScreen}
    <Menu></Menu>
{:else}
    <SmallScreen></SmallScreen>
{/if}
