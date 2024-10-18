import { getCookieValue } from './utils.js';
import { sendRequest } from './api.ts';


// @ts-ignore
export function getTokenAndRefreshToken() {
    return {
        token: getCookieValue(document.cookie, 'token'),
        refreshToken: getCookieValue(document.cookie, 'refreshToken')
    };
}

// @ts-ignore
export async function refreshAccessToken(token, refreshToken) {
    if(!token || !refreshToken) {
        const tokens = getTokenAndRefreshToken();
        token = tokens.token;
        refreshToken = tokens.refreshToken;
    }
    const response = await sendRequest('token/refresh', 'POST', { Token: token, RefreshToken: refreshToken })
    if(response.ok) {
        const data = await response.json();
        return {token: data.token, refreshToken: data.refreshToken};
    } else {
        return null;
    }
}