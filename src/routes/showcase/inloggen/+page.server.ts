import { redirect, fail } from '@sveltejs/kit';
import { sendRequest } from '$lib/api';
import { dev } from '$app/environment';

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const email = form.get('email');
        const password = form.get('password');

        // Check if the email and password are provided
        if (!email || !password) fail(400, { errors: { BadRequest: true}});
        if (typeof email !== 'string' || typeof password !== 'string')
            return fail(400, { errors: { BadRequest: true}});

        // Send the request to the server API
        const response = await sendRequest('account/login', 'POST', { email, password });
        let responseJson = await response.json();
        
        // Check if the response is ok
        if (!response.ok){
            const lastEmail = cookies.get('lastEmail');
            let attempts = cookies.get('attempts');

            if(lastEmail){
                if(lastEmail === email){
                    if(attempts){
                        cookies.set('attempts', String(parseInt(attempts) + 1), {
                            path: '/',
                            httpOnly: false,
                            sameSite: 'strict',
                            secure: !dev,
                            maxAge: 60 * 5});
                    } else {
                        cookies.set('attempts', "1", {
                            path: '/',
                            httpOnly: false,
                            sameSite: 'strict',
                            secure: !dev,
                            maxAge: 60 * 5});
                    }
                }
            } 
            cookies.set('lastEmail', email, {
                path: '/', 
                httpOnly: false, 
                sameSite: 'strict', 
                secure: !dev, 
                maxAge: 60 * 60 });
            
            attempts = cookies.get('attempts');
            if(attempts && parseInt(attempts) >= 5){
                return fail(400, { email: email, errors: { TooManyAttempts: true }});
            }
            return fail(400, { email: email, errors: responseJson.errors});
        } 

        cookies.set('token', responseJson.token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 30 * 6
        });

        cookies.set('refreshToken', responseJson.refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 30 * 6
        });
        
        throw redirect(303, '/showcase');
    }
};