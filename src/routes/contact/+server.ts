/** @type {import('./$types').RequestHandler} */
import DOMPurify from 'dompurify';

export async function POST({request}) {
    // Parse the JSON data manually
    const data = JSON.parse(await request.text());
    
    // Get the domain from an environment variable
    const domain = import.meta.env.MODE === 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
    
    // Send the data to the server API
    const apiResponse = await fetch(`${domain}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // Parse the response;
    console.log(apiResponse);

    return apiResponse;
};