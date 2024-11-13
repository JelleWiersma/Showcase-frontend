export interface User {
    email: string;
    username: string;
    admin: boolean;
    loggedIn: boolean | null;
    gamesPlayed: number | null;
    gamesLost: number | null;
    lastPlayed: Date | null;
}