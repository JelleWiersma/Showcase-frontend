import { writable } from 'svelte/store';
import { WebSocketDTO, MessageType } from '$lib/models/WebSocketDTO';

class WebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket | null = null;
    private messageHandlers: ((message: WebSocketDTO) => void)[] = [];
    public messages = writable<WebSocketDTO[]>([]);
    private isConnected = writable<boolean>(false);
    private lastMessageDate = new Date();
    private heartbeatInterval: number | null = null;
    private lastUrl: string = '';

    private constructor() {}

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public async connect(url: string, token: string): Promise<boolean> {
        if(this.isConnected && this.lastUrl === url) {
            return true;
        }

        if (this.socket) {
            this.socket = null;
        }

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connected.');
            this.sendToken(token);
            this.startHeartbeat();
        };

        this.socket.onmessage = (event) => {
            const message = WebSocketDTO.parse(event.data);

            if (message.type === MessageType.Connected || message.type === MessageType.Reconnected) {
                this.isConnected.set(true);
                console.log('WebSocket connection established.');
            } else if (message.type === MessageType.Close) {
                this.socket?.close();
                this.isConnected.set(false);
                console.log('WebSocket connection closed by server.');
            } else if(message.type === MessageType.Ping) {
                this.sendMessage(new WebSocketDTO(MessageType.Pong, message.playerId));
            } else if(message.type === MessageType.Pong) {
                this.lastMessageDate = new Date();
            }
            else if (message.type === MessageType.Unknown) {
                console.warn('Unknown WebSocket message:', message);
            } else {
                this.messages.update((msgs) => [...msgs, message]);
                this.messageHandlers.forEach((handler) => handler(message));
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected.');
            var message = new WebSocketDTO(MessageType.Close, '');
            this.messages.update((msgs) => [...msgs, message]);
                this.messageHandlers.forEach((handler) => handler(message));
            this.isConnected.set(false);
            this.socket = null;
            this.stopHeartbeat();
            this.messageHandlers = [];
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.isConnected.set(false);
            this.socket?.close();
        };

        return true;
    }

    public async disconnect(): Promise<void> {
        if (this.socket) {
            this.socket.close();
        }
    }

    private sendToken(token: string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const tokenMessage = new WebSocketDTO(MessageType.Token, '', { token });
            this.socket.send(tokenMessage.serialize());
        }
    }

    private startHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = window.setInterval(() => {
            var timeSinceLastMessage = new Date().getTime() - this.lastMessageDate.getTime();
            if (this.isConnected && timeSinceLastMessage > 60000) {
                const heartbeatMessage = new WebSocketDTO(MessageType.Ping, '');
                this.socket!.send(heartbeatMessage.serialize());
                console.log('Sent heartbeat to server.');
            } else if (this.isConnected && timeSinceLastMessage > 120000) {
                console.log('No response from server, closing connection.');
                this.socket!.close();
            }
        }, 60000); // Check if heartbeat is necessary every 60 seconds
    }

    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    public sendMessage(message: WebSocketDTO): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN && this.isConnected) {
            this.socket.send(message.serialize());
        } else {
            console.warn('WebSocket is not connected.');
        }
    }

    public addMessageHandler(handler: (message: WebSocketDTO) => void): void {
        this.messageHandlers.push(handler);
    }

    public removeMessageHandler(handler: (message: WebSocketDTO) => void): void {
        this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    }
}

export const webSocketService = WebSocketService.getInstance();