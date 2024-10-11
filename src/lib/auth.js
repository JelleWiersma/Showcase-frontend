import { getCookieValue } from './utils.js';

// @ts-ignore
export async function register(email, username, password) {
    const res = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
    });

    if (!res.ok) {
        throw new Error('Registration failed');
    }
}

// @ts-ignore
export async function verifyEmail(userId, token) {
    const res = await fetch(`/api/account/verify-email?userId=${userId}&token=${token}`);

    if (!res.ok) {
        throw new Error('Email verification failed');
    }
}

// @ts-ignore
export async function login(email, password, rememberMe = true) {
    const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: 'include' // Include cookies in the request
    });

    if (res.ok) {
        const { token: serverToken, refreshToken } = await res.json();
        document.cookie = `token=${serverToken}; HttpOnly`;
        document.cookie = `refreshToken=${refreshToken}; HttpOnly`;
    } else {
        throw new Error('Login failed');
    }
}

// @ts-ignore
export async function forgotPassword(email) {
    const res = await fetch('/api/account/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });

    if (!res.ok) {
        throw new Error('Forgot password failed');
    }
}

// @ts-ignore
export async function resetPassword(email, resetCode, newPassword) {
    const res = await fetch('/api/account/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword })
    });

    if (!res.ok) {
        throw new Error('Reset password failed');
    }
}

// @ts-ignore
export async function refreshToken(token, refreshToken) {
    const res = await fetch('/api/token/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, refreshToken })
    });

    if (res.ok) {
        const { token: newToken } = await res.json();
        token = newToken;
    } else {
        throw new Error('Token refresh failed');
    }
}

// @ts-ignore
let tokenExpiration = null;
export async function refreshTokenIfNeeded() {
    const now = Date.now();
    // @ts-ignore
    if (now >= tokenExpiration) {
        const { token: currentToken, refreshToken } = getTokenAndRefreshToken(); // get token and refresh token from where you stored them
        const res = await fetch('/api/token/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: currentToken, refreshToken })
        });

        if (res.ok) {
            const { token: newToken, expiresIn } = await res.json();
            setTokenAndRefreshToken(newToken, refreshToken); // store the new token and refresh token
            tokenExpiration = now + expiresIn * 1000; // set the new token expiration time
        } else {
            throw new Error('Token refresh failed');
        }
    }
}

// @ts-ignore
export function getTokenAndRefreshToken() {
    return {
        token: getCookieValue(document.cookie, 'token'),
        refreshToken: getCookieValue(document.cookie, 'refreshToken')
    };
}

// @ts-ignore
export function setTokenAndRefreshToken(token, refreshToken) {
    document.cookie = `token=${token}; HttpOnly`;
    document.cookie = `refreshToken=${refreshToken}; HttpOnly`;
}