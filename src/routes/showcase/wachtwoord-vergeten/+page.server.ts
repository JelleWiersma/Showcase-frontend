import { fail, redirect } from '@sveltejs/kit';
import { sendRequest } from '$lib/server/api';

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const email = form.get('email');

        // Check if the email is provided
        if (!email) fail(400, { errors: { BadRequest: true } });
        if (typeof email !== 'string') return fail(400, { errors: { BadRequest: true } });

        // Send the request to the server API for password reset
        const response = await sendRequest('account/forgot-password', 'POST', { Email: email });

        // Check if the response is ok
        if (!response.ok) {
            return fail(400, { email: email, errors: "Request failed" });
        }

        return redirect(303, '/showcase?reset=confirm');
    }
};
