import { getCookieValue } from './utils.js';
import { sendRequest } from './api.ts';
import type { RequestEvent } from '@sveltejs/kit';


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

// @ts-ignore
export async function handleTokenRefresh(eventOrCookies) {
    let token, refreshToken, cookies;
    if (isRequestEvent(eventOrCookies)) {
        cookies = eventOrCookies.cookies;
    } else {
        cookies = eventOrCookies;
    }
    token = cookies.get('token');
    refreshToken = cookies.get('refreshToken');

    if (!token || !refreshToken) {
        return null;
    }

    const result = await refreshAccessToken(token, refreshToken);
    const dev = process.env.NODE_ENV === 'development';
    if (result) {
        cookies.set('token', result.token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 30 * 6
        });
        cookies.set('refreshToken', result.refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 30 * 6
        });
        return result;
    }
    return null;
}

function isRequestEvent(obj: any): obj is RequestEvent {
    return obj && typeof obj.cookies === 'object' && typeof obj.cookies.get === 'function';
}