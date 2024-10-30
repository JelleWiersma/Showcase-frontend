import { sendAuthenticatedRequest } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const requestData = await request.json();
        if (!requestData || !requestData.method || !requestData.endpoint) {
            return new Response(JSON.stringify({ error: 'Bad Request: Missing method or endpoint.' }), { status: 400 });
        }
        const response = await sendAuthenticatedRequest(requestData.endpoint, requestData.method, requestData.method === 'GET' ? null : requestData.data, cookies);
        const responseBody = await response.text();
        const newResponse = new Response(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });

        return newResponse;
    } catch (error) {
        return new Response(JSON.stringify({ error: 'An error occurred while processing the request.' }), { status: 500 });
    }
}
