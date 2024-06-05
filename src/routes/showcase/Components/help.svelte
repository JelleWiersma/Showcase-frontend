{#if isOpen}
<div class="background" role="presentation" on:click={close}>
    <div class="card-overlay" transition:slide="{{duration: 500, easing: backIn, axis: 'y'}}">
        <button class="close-button" on:click={close}>X</button>
        <!-- Your content here -->
    </div>
</div>
{/if}

<script>
    import { slide } from 'svelte/transition';
    import { backIn } from 'svelte/easing';
    import { two_of_clubs } from '$lib/images/cards/2_of_clubs.webp'
    

    let isOpen = false;

    function open() {
        isOpen = true;
    }

    function close() {
        isOpen = false;
    }
    
    export { open, close, isOpen };
</script>

<style>
    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px;
        border: none;
        cursor: pointer;
        box-shadow: none;
        width: 2rem;
        height: 2rem;
        
    }

    .card-overlay {
        position: fixed;
        top: 40px;
        left: calc(50vw - 360px);
        width: 720px;
        height: calc(100svh - 80px);
        background-color: var(--color-bg-1);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999999;
    }
</style>