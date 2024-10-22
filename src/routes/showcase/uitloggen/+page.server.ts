import { sendAuthenticatedRequest } from "$lib/api";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ cookies }) => {
        const response = await sendAuthenticatedRequest('account/logout', 'POST', {}, cookies);
        cookies.delete('token', { path: '/' });
        cookies.delete('refreshToken', { path: '/' });
        return redirect(303, '/showcase');
    }
};