{#if isOpen}
    <div class="card-overlay" transition:slide="{{duration: 500, easing: backIn, axis: 'y'}}">
        <button class="close-button" on:click={close}>X</button>
        <!-- Your content here -->
    </div>
{/if}

<script>
    import { slide } from 'svelte/transition';
    import { backIn } from 'svelte/easing';
    

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
        z-index: 999999;
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
</style>