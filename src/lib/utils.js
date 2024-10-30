

//@ts-nocheck
export function getCookieValue(cookies, name) {
    const cookie = cookies.split(';').find(cookie => cookie.trim().startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : '';
}

export async function sendRequest(endpoint, method = 'GET', body) {
    const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
    
    if (endpoint.startsWith('/')) {
        endpoint = endpoint.slice(1);
    }

    let headers = {
        'Content-Type': 'application/json',
        
    };

    // Send the request to the server API
    const response = await fetch(`${domain}/api/${endpoint}`, {
        method,
        headers: headers,
        body: method != 'GET'? JSON.stringify(body): null
    });

    // Parse and return the response
    return response;
}