<script>
    //@ts-nocheck
    import Help from "../Components/help.svelte";
    import {goto, beforeNavigate} from "$app/navigation";
    import Lobby from "../Components/lobby.svelte";
    import { onMount } from "svelte";
    
    /**
     * @type {Help}
     */
    let help;

    /**
     * @type {Lobby}
     */
    let lobby;

    export let data;

    let winRate = 0;
    let lastPlayed = '';
    let gamesPlayed = 0;
    let gamesLost = 0;
    let gamesWon = 0;
    let isHost = false;

    onMount(async () => {
        if(data && data.user && data.user.LoggedIn) {
            winRate = data.user.GamesPlayed > 0? Math.round(((data.user.GamesPlayed - data.user.GamesLost) / data.user.GamesPlayed) * 100) : 0;
            lastPlayed = data.user.LastPlayed? new Date(data.user.LastPlayed).toLocaleString() : '';
            gamesPlayed = data.user.GamesPlayed? data.user.GamesPlayed : 0;
            gamesLost = data.user.GamesLost? data.user.GamesLost : 0;
            gamesWon = data.user.GamesPlayed - data.user.GamesLost;

            if(data.code) {
                lobby.connect(data.token, data.code);
            } else {
                isHost = true;
                lobby.connect(data.token);
            }
        } else {
            goto/('/showcase');
        }
    });
    

    async function handleLeave() {
        await lobby.disconnect();
        goto('/showcase');
    }
</script>

<svelte:head>
    <title>Lobby</title>
</svelte:head>
<div class="content">
    <span class="title-text">Zweeds Pesten</span>
    <p style="margin: 0px">Welkom bij de showcase! Om een indruk te geven van mijn vaardigheden heb ik een online kaartspel gemaakt. In sommige kringen wordt dit spel “Klootzakken” genoemd, maar in mijn omgeving staat het bekend als “Zweeds Pesten”. Dus nodig een paar vrienden uit, probeer ze te verslaan, en veel plezier!</p>
    <div class="horizontal-line"></div>
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
    <Lobby bind:localPlayerId={data.user.Id} bind:isHost={isHost} bind:this={lobby}></Lobby>
    <div class="horizontal-line"></div>
    {#if isHost}
        <button class="menu-button">Spel Starten</button>
    {:else}
        <p>Verbonden met Lobby, wacht tot de host het spel start</p>
    {/if}
    <button class="menu-button" on:click={help.open()}>Speluitleg</button>
    <button class="menu-button" on:click={handleLeave}>Lobby verlaten</button>
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





