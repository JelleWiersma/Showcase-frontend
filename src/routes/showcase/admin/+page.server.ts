import { sendAuthenticatedRequest } from "$lib/server/api";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    const response = await sendAuthenticatedRequest('player/all', 'GET', {}, cookies);
    const userCookie = cookies.get('user');
    const currentPlayer = JSON.parse(userCookie!);
    
    if(response.ok){
        const players = await response.json();
        return {
            players: players,
            currentPlayer: currentPlayer
        };
    } else {
        return {
            players: []
        };
    }
};