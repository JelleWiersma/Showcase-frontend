<script>
    import Help from "./help.svelte";
    import {goto} from "$app/navigation";

    let loggedIn = false;
    /**
     * @type {Help}
     */
    let help;
</script>

<div class="content">
    <span class="title-text">Zweeds Pesten</span>
    <p style="margin: 0px">Welkom bij de showcase! Om een indruk te geven van mijn vaardigheden heb ik het een online kaartspel gemaakt. In sommige kringen wordt dit spel “Klootzakken” genoemd, maar in mijn omgeving staat het bekend als “Zweeds Pesten”. Dus nodig een paar vrienden uit, probeer ze te verslaan, en veel plezier!</p>
    <div class="horizontal-line"></div>
    <button class="menu-button" on:click={() => goto('/showcase/login')}>Inloggen</button>
    <button class="menu-button" on:click={() => goto('/showcase/register')}>Account maken</button>
    <button class="menu-button" on:click={help.open()}>Speluitleg</button>
</div>

<Help bind:this={help}></Help>

<style>
    .menu-button {
        width: 50%;
        align-self: center;
        border-radius: 5px;
        color: var(--color-theme-1);
    }

    .menu-button:hover {
        background-color: var(--color-theme-1);
        color: white;
    }
</style>


