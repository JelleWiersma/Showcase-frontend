<script>
    import Help from "./help.svelte";
    import {goto} from "$app/navigation";
    import { webSocketService } from "$lib/websocket";
    import { onMount } from "svelte";
    
    /**
     * @type {Help}
     */
    let help;

    let code = '';
    let winRate = 0;
    let lastPlayed = '';
    let gamesPlayed = 0;
    let gamesLost = 0;
    let gamesWon = 0;
    let loggedIn = false;

    export let data;

    if(data && data.user && data.user.LoggedIn) {
        winRate = data.user.GamesPlayed > 0? Math.round(((data.user.GamesPlayed - data.user.GamesLost) / data.user.GamesPlayed) * 100) : 0;
        lastPlayed = data.user.LastPlayed? new Date(data.user.LastPlayed).toLocaleString() : '';
        gamesPlayed = data.user.GamesPlayed? data.user.GamesPlayed : 0;
        gamesLost = data.user.GamesLost? data.user.GamesLost : 0;
        gamesWon = data.user.GamesPlayed - data.user.GamesLost;
        loggedIn = true;
    }

    onMount(() => {
        if(data && data.user && data.user.LoggedIn) {
            webSocketService.disconnect();
        }
    });

    async function handleLogout() {
        const response = await fetch('/showcase/uitloggen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams()
        });
        if(response.ok) {
            location.reload();
        }
    }
</script>

<div class="content">
    <span class="title-text">Zweeds Pesten</span>
    <p style="margin: 0px">Welkom bij de showcase! Om een indruk te geven van mijn vaardigheden heb ik een online kaartspel gemaakt. In sommige kringen wordt dit spel “Klootzakken” genoemd, maar in mijn omgeving staat het bekend als “Zweeds Pesten”. Dus nodig een paar vrienden uit, probeer ze te verslaan, en veel plezier!</p>
    <p style="margin: 0px">Het spel is helaas nog niet speelbaar, maar het maken van accounts en joinen van lobbies kan vast getest worden.</p>
    <div class="horizontal-line"></div>
    {#if loggedIn}
        <div class="player-stats">
            <div class="stats-header">
                <span class="subtitle">{data.user.Username}</span>
            </div>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-title">Gespeeld</span>
                    <span class="stat-value">{gamesPlayed}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-title">Gewonnen</span>
                    <span class="stat-value">{gamesWon}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-title">Verloren</span>
                    <span class="stat-value">{gamesLost}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-title">Win Rate</span>
                    <span class="stat-value">{winRate}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-title">Laatste Pot</span>
                    <span class="stat-value">{lastPlayed}</span>
                </div>
            </div>
        </div>
        <div class="horizontal-line"></div>
        <button class="menu-button" on:click={() => goto('/showcase/lobby')}>Lobby Hosten</button>
        <div class="nice-form-group" style="width: 50%; align-self:center; margin-top: 5px;">
            <input type="text" id="lobby-code" placeholder="Lobby code" style="box-sizing:border-box" bind:value={code} maxlength="6">
        </div>
        <button class="menu-button" on:click={() => code != ''? goto('/showcase/lobby?c=' + code): null}>Lobby Joinen</button>
        <button class="menu-button" on:click={handleLogout}>Uitloggen</button>
        {#if data.user && data.user.Admin}
            <button class="menu-button" on:click={() => goto('/showcase/admin')}>Admin Dashboard</button>
        {/if}
    {:else}
        <button class="menu-button" on:click={() => goto('/showcase/inloggen')}>Inloggen</button>
        <button class="menu-button" on:click={() => goto('/showcase/aanmelden')}>Account maken</button>
    {/if}
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

    .player-stats {
        display: flex;
        flex-direction: column;
    }

    .stats-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 15px;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 5px;
    }
    .stat-value {
        margin-top: 5px;
    }
</style>


