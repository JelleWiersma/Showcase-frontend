import pkg from 'validator';
const { escape } = pkg;
import { handleTokenRefresh } from './auth';
import { redirect, type Cookies } from '@sveltejs/kit';

export async function sendSanitizedRequest(endpoint: string, method: string, data: any) {
    // Get the domain from an environment variable
    const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;

    // Sanitize the data
    const sanitizedData: { [key: string]: any } = {};
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            sanitizedData[key] = escape(data[key]);
        }
    }

    // Send the request to the server API
    const response = await fetch(`${domain}/api/${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sanitizedData)
    });

    // Parse and return the response
    return response;
}

export async function sendRequest(endpoint: string, method: string, data: any) {
    // Get the domain from an environment variable
    const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;

    // Send the request to the server API
    const response = await fetch(`${domain}/api/${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // Parse and return the response
    return response;
}

export async function sendAuthenticatedRequest(endpoint: string, method: string, data: any, cookies: Cookies) {
    // Get the domain from an environment variable
    const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
    const token = cookies.get('token');

    // Send the request to the server API
    let response = await fetch(`${domain}/api/${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: method != 'GET'? JSON.stringify(data): null
    });

    if(response.status === 401){
        const newTokens = await handleTokenRefresh(cookies);
        if(newTokens){
            response = await fetch(`${domain}/api/${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newTokens.token}`
                },
                body: JSON.stringify(data)
            });
        } else {
            return redirect(303, '/showcase/inloggen');
        }
    }
    // Parse and return the response
    return response;
}