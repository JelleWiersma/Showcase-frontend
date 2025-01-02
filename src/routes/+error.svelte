<svelte:head>
    <title>Error</title>
</svelte:head>

<script>
// @ts-nocheck

    import { hideNavigation } from "$lib/store";
    import { onMount } from "svelte";
    import { page } from '$app/stores';

    onMount(() => {
        hideNavigation.set(false);
    });

    var status;

    var error;

    page.subscribe(value => {
        status = value.status;
        error = value.error;
    });
</script>

<div class="content">
    <span class="title-text">Oeps!</span>
    <div class="horizontal-line"></div>
    <p style="margin: 0px">Er is een fout voorgekomen:</p>
    <p style="margin: 0px"><b>{status}: {error.message}</b></p>
</div>