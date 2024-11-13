<script>
// @ts-nocheck
    import { sendAuthenticatedRequest } from '$lib/utils';
    export let data;
    let players = data.players;

    async function removeButton(player) {
        if (confirm(`Weet je zeker dat je ${player.username} wil verwijderen?`)) {
            try {
                const response = await sendAuthenticatedRequest(`account/${player.id}`, 'DELETE', {});

                if (response.ok) {
                    players = players.filter(p => p.id !== player.id);
                } else {
                    console.error('Failed to remove player');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

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
                <th></th>
                <th>email</th>
                <th>username</th>
                <th>rol</th>
                <th>gespeeld</th>
                <th>verloren</th>
                <th>laatst gespeeld</th>
            </tr>
        </thead>
        <tbody>
            {#each players as player}
                <tr>
                    <td><button class='remove-button' on:click={() => {removeButton(player)}}>X</button></td>
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

    .remove-button {
        cursor: pointer;
        width: 20px;
        height: 20px;
        border: 0;
        background-color: transparent;
        box-shadow: none;
        padding: 0;
    }

    .remove-button:hover {
        color: var(--color-error);
    }
</style>