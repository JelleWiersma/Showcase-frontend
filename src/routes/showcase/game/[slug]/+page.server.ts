import { webSocketService } from '$lib/websocket';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    if(webSocketService.isConnected){
        webSocketService.disconnect();
    }
};