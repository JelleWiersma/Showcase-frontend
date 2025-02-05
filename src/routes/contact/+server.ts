import { sendSanitizedRequest } from '$lib/server/api';
import { json } from '@sveltejs/kit';

export async function POST({request}) {
    // Parse the JSON data manually
    const data = JSON.parse(await request.text());

    // Make the API request
    const apiResponse = await sendSanitizedRequest('contact', 'POST', data);

    // Return the response
    return json(apiResponse);
}

export async function GET() {
    return;
}