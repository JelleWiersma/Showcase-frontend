import { sendRequest } from './api.ts';
import type { Cookies, RequestEvent } from '@sveltejs/kit';


export async function refreshAccessToken(token: string, refreshToken: string) {
    if(!token || !refreshToken) {
        return null;
    }
    const response = await sendRequest('token/refresh', 'POST', { Token: token, RefreshToken: refreshToken })
    if(response.ok) {
        const data = await response.json();
        return {token: data.token, refreshToken: data.refreshToken};
    } else {
        return null;
    }
}


export async function handleTokenRefresh(eventOrCookies: RequestEvent | Cookies) {
    let cookies: Cookies;
    if (isRequestEvent(eventOrCookies)) {
        cookies = eventOrCookies.cookies;
    } else {
        cookies = eventOrCookies;
    }
    const token = cookies.get('token');
    const refreshToken = cookies.get('refreshToken');

    if (!token || !refreshToken) {
        return null;
    }

    const result = await refreshAccessToken(token, refreshToken);
    if (result) {
        const dev = process.env.NODE_ENV === 'development';
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