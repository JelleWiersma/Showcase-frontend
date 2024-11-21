<script>
    import Menu from "./Components/menu.svelte";
    import { hideNavigation } from "$lib/store";
    import { onMount } from "svelte";
    import SmallScreen from "./Components/smallScreen.svelte";
    import { page } from '$app/stores';
    
    let innerWidth = 0;
    let isSmallScreen = false;
    let message = '';
    let messageType = '';

    export let data;

    $: {
        const verify = $page.url.searchParams.get('verify');
        const reset = $page.url.searchParams.get('reset');

        if (verify === 'success') {
            message = 'Je email is geverifieerd. Je kan nu inloggen.';
            messageType = 'confirmation';
        } else if (verify === 'failed') {
            message = 'Je email kon niet geverifieerd worden. Probeer het later opnieuw.';
            messageType = 'failure';
        } else if (reset === 'success') {
            message = 'Je wachtwoord is gereset. Je kan nu inloggen.';
            messageType = 'confirmation';
        } else if (reset === 'confirm') {
            message = 'Email verstuurd. Check je email om je wachtwoord te veranderen.';
            messageType = 'confirmation';
        } else {
            message = '';
            messageType = '';
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

{#if message}
    <div class={messageType === 'confirmation' ? 'confirmation-message' : 'failure-message'}>
        {message}
        <button on:click={() => { message = ''; messageType = ''; }}>X</button>
    </div>
{/if}

{#if !isSmallScreen}
    <Menu {data}></Menu>
{:else}
    <SmallScreen></SmallScreen>
{/if}
