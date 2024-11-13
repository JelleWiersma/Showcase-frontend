import { sendAuthenticatedRequest } from "$lib/server/api";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    const response = await sendAuthenticatedRequest('player/all', 'GET', {}, cookies);
    
    if(response.ok){
        const players = await response.json();
        return {
            players: players
        };
    } else {
        return {
            players: []
        };
    }
};