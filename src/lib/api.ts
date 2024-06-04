import pkg from 'validator';
const { escape } = pkg;

export async function makeRequest(endpoint: string, method: string, data: any) {
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