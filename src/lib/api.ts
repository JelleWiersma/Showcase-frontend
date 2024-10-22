import pkg from 'validator';
const { escape } = pkg;
import { handleTokenRefresh } from './auth';
import { redirect, type Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

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
        body: method != 'GET'? JSON.stringify(sanitizedData): null
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
        body: method != 'GET'? JSON.stringify(data): null
    });

    // Parse and return the response
    return response;
}

export async function sendAuthenticatedRequest(endpoint: string, method: string, data: any, cookies: Cookies) {
    // Get the domain from an environment variable
    const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
    let token = cookies.get('token');
    let response;
    
    try {
        if(!token) return redirect(303, '/showcase/inloggen');
        const decoded = jwt.verify(token, import.meta.env.VITE_JWT_KEY);

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            //refresh token
            const newTokens = await handleTokenRefresh(cookies);
            
            if(newTokens){
                token = newTokens.token;
            } else {
                return redirect(303, '/showcase/inloggen');
            }
        } else {
            return redirect(303, '/showcase/inloggen');
        }
    }

    // Send the request to the server API
    response = await fetch(`${domain}/api/${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: method != 'GET'? JSON.stringify(data): null
    });

    return response;
}