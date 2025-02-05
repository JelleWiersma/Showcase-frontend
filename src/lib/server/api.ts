import pkg from 'validator';
const { escape } = pkg;
import { handleTokenRefresh } from './auth';
import { redirect, type Cookies } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
export async function sendRequest(endpoint: string, method: string, data: any, token: string | null = null) {
    // Remove a possible leading slash from the endpoint
    if (endpoint.startsWith('/')) {
        endpoint = endpoint.slice(1);
    }

    let headers = {
        'Content-Type': 'application/json',
    };
    if(token){
        //@ts-ignore
        headers.authorization = `Bearer ${token}`;
    }

    // Send the request to the server API
    const response = await fetch(`${domain}/api/${endpoint}`, {
        method,
        headers: headers,
        body: method != 'GET'? JSON.stringify(data): null
    });

    // Parse and return the response
    return response;
}

export async function sendSanitizedRequest(endpoint: string, method: string, data: any) {
    // Sanitize the data
    const sanitizedData: { [key: string]: any } = {};
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            sanitizedData[key] = escape(data[key]);
        }
    }

    // Send the request to the server API
    const response = sendRequest(endpoint, method, sanitizedData);

    // Parse and return the response
    return response;
}

export async function sendAuthenticatedRequest(endpoint: string, method: string, data: any, cookies: Cookies) {
    // Get the tokens
    let token;
    let refreshToken;
    if (cookies) {
        token = cookies.get('token');
        refreshToken = cookies.get('refreshToken');
    }

    // Check if the token is valid. If not, refresh it
    if (!token) return new Response('Unauthorized', { status: 401 });

    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        // Refresh token
        let newTokens = await handleTokenRefresh(cookies);
        if (newTokens) {
            token = newTokens.token;
        } else {
            return new Response('Unauthorized', { status: 401 });
        }
    }

    // Send the request to the server API
    const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
    const response = await fetch(`${domain}/api/${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: method !== 'GET' ? JSON.stringify(data) : null
    });

    return response;
}