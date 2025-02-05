export interface User {
    Id: string,
    Email: string | null;
    Username: string;
    Admin: boolean | null;
    LoggedIn: boolean | null;
    GamesPlayed: number | null;
    GamesLost: number | null;
    LastPlayed: Date | null;
}