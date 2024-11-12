import { redirect, fail } from '@sveltejs/kit';
import { sendRequest } from '$lib/server/api';
import { dev } from '$app/environment';

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();

        const requestBody = {
            Email: form.get('email'),
            Password: form.get('password'),
            RememberMe: form.get('rememberMe') === 'on',
            MfaCode: form.get('twoFactorCode')? form.get('twoFactorCode'): null
        };
        console.log(requestBody);

        // Check if the email and password are provided
        if (!requestBody.Email || !requestBody.Password || typeof requestBody.Email !== 'string' || typeof requestBody.Password !== 'string') fail(400, { errors: { BadRequest: true}});

        // Send the request to the server API
        const response = await sendRequest(requestBody.MfaCode? 'account/mfa-login': 'account/login' , 'POST', requestBody);
        
        let responseJson = await response.json();
        
        // Check if the response is ok
        if (!response.ok){
            if(responseJson.requiresTwoFactor){
                return fail(401, { email: requestBody.Email, password: requestBody.Password, rememberMe: requestBody.RememberMe, TwoFactorRequired: true});
            }
            const lastEmail = cookies.get('lastEmail');
            let attempts = cookies.get('attempts');

            if(lastEmail){
                if(lastEmail === requestBody.Email){
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
            //@ts-ignore
            cookies.set('lastEmail', requestBody.Email, {
                path: '/', 
                httpOnly: false, 
                sameSite: 'strict', 
                secure: !dev, 
                maxAge: 60 * 60 });
            
            attempts = cookies.get('attempts');
            if(attempts && parseInt(attempts) >= 5){
                return fail(401, { email: requestBody.Email, TooManyAttempts: true });
            }
            return fail(401, { email: requestBody.Email});
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

