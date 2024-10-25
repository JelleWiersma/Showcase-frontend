export interface User {
    email: string;
    username: string;
    role: string;
    loggedIn: boolean | null;
    gamesPlayed: number | null;
    gamesLost: number | null;
    lastPlayed: Date | null;
}