<script lang="ts">
    import { goto } from "$app/navigation";
    import type { User } from "$lib/models/User";
    import { WebSocketDTO, MessageType } from "$lib/models/WebSocketDTO";
    import { webSocketService } from "$lib/websocket";
    import { onDestroy } from "svelte";

    export let isHost: boolean;
    export let localPlayerId: string;

    let connected: boolean;
    let lobbyCode = '';
    let users: [User | null, User | null, User | null, User | null] = [null, null, null, null];

    const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;

    // Connect to the websocket. The server handles reconnects.
    export async function connect(token: string, code: string | null = null) {
        if(code) {
            lobbyCode = code;
            connected = await webSocketService.connect(`${domain}/api/game/ws/${code}`, token);
            isHost = false;
        } else {
            connected = await webSocketService.connect(`${domain}/api/game/ws/`, token);
            isHost = true;
        }
        if(connected) {
            webSocketService.addMessageHandler(messageHandler);
        } else {
            console.error('Failed to connect to websocket');
        }
    }

    export async function disconnect() {
        await webSocketService.disconnect();
        connected = false;
    }

    export function startGame() {
        if(isHost && connected && users.length > 1) {
            webSocketService.sendMessage(new WebSocketDTO(MessageType.StartGame, localPlayerId));
        }
        
    }

    // if the component is not on screen, remove the message handler
    // this is to prevent memory leaks
    onDestroy(() => {
        webSocketService.removeMessageHandler(messageHandler);
    });

    // After the websocketservice completes a connection, it will call this function with the remaining messages
    async function messageHandler(message: WebSocketDTO) {
        switch (message.type) {
            case MessageType.LobbyCode:
                lobbyCode = message.variables?.Code;
                break;
            case MessageType.LobbyPlayers:
                
                const players = message.variables?.Players as Array<User>;
                const hostId = message.variables?.Host;

                users = [null, null, null, null];

                players.forEach((player) => {
                    if (player.Id === hostId) {
                        users[0] = player;
                    } else {
                        for (let i = 1; i < users.length; i++) {
                            if (users[i] === null) {
                                users[i] = player;
                                break;
                            }
                        }
                    }
                });
                break;
            case MessageType.PlayerJoin:
                const player = message.variables?.Player as User;
                for (let i = 1; i < users.length; i++) {
                    if (users[i] === null) {
                        users[i] = player;
                        break;
                    }
                }
                break;
            case MessageType.PlayerLeft:
                const playerId = message.playerId as string;
                for (let i = 1; i < users.length; i++) {
                    if (users[i]?.Id === playerId) {
                        users[i] = null;
                        break;
                    }
                    
                }
                removeGaps();
                break;
            case MessageType.NewHost:
                const newHostId = message.playerId as string;
                const index = users.findIndex((user) => user?.Id === newHostId);
                if (index !== -1 && index !== 0) {
                    users[0] = users[index];
                    users[index] = null;
                }
                if (newHostId === localPlayerId) {
                    isHost = true;
                }
                removeGaps();
                break;
            
            case MessageType.Close:
                connected = false;
                break;

            case MessageType.GameStarting:
                goto(`/showcase/game/${lobbyCode}`);
                break;
        }
    }

    function removeGaps() {
        users = users.filter(user => user !== null) as [User | null, User | null, User | null, User | null];
        while (users.length < 4) {
            users.push(null);
        }
    }
    
</script>

{#if connected === false}
    <p>Kon niet verbinden met Lobby. Probeer het later opnieuw</p>
{:else}
    <span class="subtitle">Lobby: {lobbyCode}</span>
    <ul style="margin-top: 0px;">
        <li><b>{users[0]?.Username? users[0].Username : ""}</b></li>
        <li>{users[1]?.Username? users[1].Username : ""}</li>
        <li>{users[2]?.Username? users[2].Username : ""}</li>
        <li>{users[3]?.Username? users[3].Username : ""}</li>
    </ul>
{/if}
