import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { VITE_JWT_KEY } from '$env/static/private';
import { getTokenAndRefreshToken, refreshAccessToken } from '$lib/auth';
import type { User } from '$lib/models/User';
import { Console } from 'console';


// custom redirect from joy of code `https://github.com/JoysOfCode/sveltekit-auth-cookies/blob/migration/src/hooks.ts`
function redirect(location: string, body?: string) {
    return new Response(body, {
        status: 303,
        headers: { location }
    });
}

const protectedRoutes: string[] = [
    '/showcase/lobby'
];

export const handle: Handle = async ({ event, resolve }) => {
    // if route is not protected, resolve
    if(!protectedRoutes.includes(event.url.pathname))
        return resolve(event);
    
    let token = event.cookies.get('token');
    let refreshToken = event.cookies.get('refreshToken');
    const dev = import.meta.env.MODE === 'development';
    
    // if no token and route is protected, redirect to login
    if (!token)
        return redirect('/showcase/inloggen', 'No authenticated user.');
    
    // verify token
    let decoded;
    try {
        decoded = await jwt.verify(token, VITE_JWT_KEY);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            //refresh token
            const result = await refreshAccessToken(token, refreshToken);
            if(result){
                ({token, refreshToken} = result);
                event.cookies.set('token', token, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: !dev,
                    maxAge: 60 * 60 * 24 * 30 * 6
                });
                event.cookies.set('refreshToken', refreshToken, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: !dev,
                    maxAge: 60 * 60 * 24 * 30 * 6
                });
                decoded = await jwt.decode(token);
            } else {
                return redirect('/showcase/inloggen', 'Invalid token.');
            }
        } else {
            // if error, redirect to login
            return redirect('/showcase/inloggen', 'Invalid token.');
        }
    }
    //cast to user
    if(typeof decoded === 'object'){
        const user = {
            email: decoded.Sub,
            username: decoded.Username,
            role: decoded.Role
        }
        event.locals.user = user;
    } else {
        console.log('could not make user from token')
        return redirect('/showcase/inloggen', 'Invalid token.');
    }
    return resolve(event);
};