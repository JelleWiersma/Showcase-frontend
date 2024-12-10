import type { User } from '$lib/models/User.ts';
import { sendAuthenticatedRequest, sendRequest } from './api.ts';
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

export async function getUser(cookies: any){
    const response = await sendAuthenticatedRequest('player', 'GET', {}, cookies);
    if(!response.ok){
        return null;
    }
    const decoded = await response.json();
    const user: User = {
        Id : decoded.id,
        Email: decoded.email,
        Username: decoded.username,
        Admin: decoded.admin,
        LoggedIn: true,
        GamesPlayed: decoded.gamesPlayed,
        GamesLost: decoded.gamesLost,
        LastPlayed: decoded.lastPlayed
    }
    return user;
}

export async function saveUser(user: User | null, cookies: any){
    if(!user) return;
    cookies.set('user', JSON.stringify(user), {
        'path': '/',
        'httpOnly': false,
        'sameSite': 'strict',
        'secure': import.meta.env.MODE === 'production',
        'maxAge': 60 * 60 * 24 * 30
    });
}
