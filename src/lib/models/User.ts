export interface User {
    id: string,
    email: string;
    username: string;
    admin: boolean;
    loggedIn: boolean | null;
    gamesPlayed: number | null;
    gamesLost: number | null;
    lastPlayed: Date | null;
}