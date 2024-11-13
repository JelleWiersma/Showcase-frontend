import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { VITE_JWT_KEY } from '$env/static/private';
import { handleTokenRefresh } from '$lib/server/auth';


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

const adminRoutes: string[] = [
    '/showcase/admin'
];

export const handle: Handle = async ({ event, resolve }) => {
    // Determine if user is logged in
    let token = event.cookies.get('token');
    if(!token && event.locals.user) event.locals.user.loggedIn = false;

    if(token) {
        const user = await verifyToken(token, event);
        if(user){
            event.locals.user = user;
        } else {
            event.cookies.delete('token', { path: '/' });
            event.cookies.delete('refreshToken', { path: '/' });
        } 
    };

    // if route is not protected, resolve
    if(!protectedRoutes.includes(event.url.pathname) && !adminRoutes.includes(event.url.pathname))
        return resolve(event);
    

    // if not logged in and route is protected, redirect to login
    if (!event.locals.user || !event.locals.user.loggedIn)
        return redirect('/showcase/inloggen', 'No authenticated user.');

    // if route is admin and user is not admin, redirect to lobby
    if(adminRoutes.includes(event.url.pathname) && !event.locals.user.admin)
        return redirect('/showcase');
    
    return resolve(event);
    
};

async function verifyToken(token: string, event: any) {
    let decoded;
    try {
        decoded = await jwt.verify(token, VITE_JWT_KEY);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            //refresh token
            const result = await handleTokenRefresh(event);
            if(result?.token){
                const newToken = result.token;
                decoded = await jwt.decode(newToken);
            } else {
                return null;;
            }
        } else {
            console.log(error);
            // if error, redirect to login
            return null;
        }
    }
    //cast to user
    if(decoded && typeof decoded === 'object'){
        const user = {
            id : decoded.jti!,
            email: decoded.Sub,
            username: decoded.Username,
            admin: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ==='Admin',
            loggedIn: true,
            gamesPlayed: null,
            gamesLost: null,
            lastPlayed: null
        }
        return user;
    } else {
        return null;;
    }
}