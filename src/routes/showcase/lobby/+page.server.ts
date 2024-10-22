import { sendAuthenticatedRequest } from '$lib/api.js';

export const actions = {
    default: async ({ request, cookies }) => {
        const response = await sendAuthenticatedRequest('status/loggedin', 'GET', {}, cookies);
        if(response.ok){
            return {message: 'logged in'};
        } else {
            return {message: 'not logged in'};
        }
    }
};