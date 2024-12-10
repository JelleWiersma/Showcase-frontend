export enum MessageType {
    Close,
    Token,
    Connected,
    Reconnected,
    LobbyCode,
    PlayerJoin,
    PlayerLeft,
    LobbyPlayers,
    NewHost,
    StartGame,
    Move,
    GameState,
    GameStarting,
    GameEnded,
    Ping,
    Pong,
    Unknown // Fallback for unrecognized messages
}

export class WebSocketDTO {
    type: MessageType;
    variables?: { [key: string]: any };
    playerId: string;

    constructor(type: MessageType, playerId: string, variables?: { [key: string]: any }) {
        this.type = type;
        this.playerId = playerId;
        this.variables = variables;
    }

    static parse(message: string): WebSocketDTO {
        try {
            const jsonObject = JSON.parse(message);

            if (
                jsonObject.Type !== undefined &&
                jsonObject.PlayerId !== undefined
            ) {
                const type = MessageType[jsonObject.Type as keyof typeof MessageType];
                const playerId = jsonObject.PlayerId;
                const variables = jsonObject.Variables;

                return new WebSocketDTO(type, playerId, variables);
            }
        } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
        }
        return new WebSocketDTO(MessageType.Unknown, "");
    }

    serialize(): string {
        const json: { [key: string]: any } = {
            Type: MessageType[this.type],
            PlayerId: this.playerId
        };

        if (this.variables) {
            json.Variables = this.variables;
        }

        return JSON.stringify(json);
    }

    getBytes(): Uint8Array {
        return new TextEncoder().encode(this.serialize());
    }

    getVariable(key: string): any {
        return this.variables ? this.variables[key] : null;
    }
}