<script lang="ts">
    import type { User } from "$lib/models/User";
    import { WebSocketDTO, MessageType } from "$lib/models/WebSocketDTO";
    import { webSocketService } from "$lib/websocket";
    import { get } from "svelte/store";

    let lobbyCode = '';
    let users: [User | null, User | null, User | null, User | null] = [null, null, null, null];
    let messages = get(webSocketService.messages);
    let connected: Boolean;
    const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;

    export async function connect(token: string, code: string | null = null) {

        if(code) {
            lobbyCode = code;
            connected = await webSocketService.connect(`${domain}/api/game/ws/${code}`, token);

        } else {
            connected = await webSocketService.connect(`${domain}/api/game/ws/`, token);
        }
        if(connected) {
            webSocketService.addMessageHandler(messageHandler);
        } else {
            console.error('Failed to connect to websocket');
        }
    }

    export function disconnect() {
        webSocketService.disconnect();
    }

    // After the websocketservice completes a connection, it will call this function with the remaining messages
    async function messageHandler(message: WebSocketDTO) {
        switch (message.type) {
            case MessageType.LobbyCode:
                lobbyCode = message.variables?.Code;
                break;
            case MessageType.LobbyPlayers:
                
                const players = message.variables?.Players as Array<User>;
                console.log(players);
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
                console.log(users);
                break;
        }
    }
</script>

{#if connected === false}
    <p>Kon niet verbinden met Lobby. Probeer het later opnieuw</p>
{:else}
    <span class="subtitle">Lobby: {lobbyCode}</span>
    <ul>
        <li>{users[0]?.Username? users[0].Username : ""}</li>
        <li>{users[1]?.Username? users[1].Username : ""}</li>
        <li>{users[2]?.Username? users[2].Username : ""}</li>
        <li>{users[3]?.Username? users[3].Username : ""}</li>
    </ul>
{/if}
