import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '$env/static/private';
import { handleTokenRefresh } from '$lib/server/auth';
import type { User } from '$lib/models/User';
import { getUser, saveUser } from '$lib/server/auth';


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
    const userCookie = event.cookies.get('user');
    let user: User | null = null;
    if(userCookie){
        user = JSON.parse(userCookie);
    }

    if(!token && user){
        user.LoggedIn = false;   
    }

    if(token) {
        const verified = await verifyToken(token, event);
        if(verified){
            if(user){
                user.LoggedIn = true;
            } else {
                user = await getUser(event.cookies);
            }
            await saveUser(user, event.cookies);
        } else {
            event.cookies.delete('token', { path: '/' });
            event.cookies.delete('refreshToken', { path: '/' });
            event.cookies.delete('user', { path: '/' });
        } 
    };

    // if route is not protected, resolve
    if(!protectedRoutes.includes(event.url.pathname) && !adminRoutes.includes(event.url.pathname))
        return resolve(event);
    

    // if not logged in and route is protected, redirect to login
    if (!user || !user.LoggedIn)
        return redirect('/showcase/inloggen', 'No authenticated user.');

    // if route is admin and user is not admin, redirect to lobby
    if(adminRoutes.includes(event.url.pathname) && !user.Admin)
        return redirect('/showcase');
    
    return resolve(event);
    
};

async function verifyToken(token: string, event: any) {
    let decoded;
    try {
        decoded = await jwt.verify(token, JWT_KEY);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            //refresh token
            const result = await handleTokenRefresh(event);
            if(result?.token){
                const newToken = result.token;
                decoded = await jwt.decode(newToken);
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    if(decoded){
        return true;
    }
    
}

