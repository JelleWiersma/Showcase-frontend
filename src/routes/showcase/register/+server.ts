import { sendSanitizedRequest } from '$lib/api';

export async function POST({request}) {
    // Parse the JSON data manually
    const data = JSON.parse(await request.text());

    // Make the API request
    const apiResponse = await sendSanitizedRequest('account/register', 'POST', data);

    // Return the response
    return apiResponse;
}

export async function GET() {
    return;
}