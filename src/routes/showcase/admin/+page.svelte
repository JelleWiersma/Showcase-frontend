<script>
    // @ts-nocheck
    import { onMount } from 'svelte';

    export let data;
    let players = data.players;

</script>

<svelte:head>
    <title>Zweeds Pesten</title>
</svelte:head>

<div class="content">
    <span class="title-text">Admin Dashboard</span>
    <div class="horizontal-line"></div>
    <table>
        <thead>
            <tr>
                <th>email</th>
                <th>username</th>
                <th>role</th>
                <th>gespeeld</th>
                <th>verloren</th>
                <th>laatst gespeeld</th>
            </tr>
        </thead>
        <tbody>
            {#each players as player}
                <tr>
                    <td>{player.email}</td>
                    <td>{player.username}</td>
                    <td>{player.admin? 'Admin' : 'Player'}</td>
                    <td>{player.gamesPlayed}</td>
                    <td>{player.gamesLost}</td>
                    <td>{player.lastPlayed? player.lastPlayed : ''}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #f2f2f2;
    }
</style>