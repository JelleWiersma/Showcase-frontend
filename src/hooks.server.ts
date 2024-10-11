import type { Handle } from '@sveltejs/kit';

// custom redirect from joy of code `https://github.com/JoysOfCode/sveltekit-auth-cookies/blob/migration/src/hooks.ts`
function redirect(location: string, body?: string) {
    return new Response(body, {
        status: 303,
        headers: { location }
    });
}

const unProtectedRoutes: string[] = [
    '/',
    '/contact',
    '/showcase',
    '/showcase/inloggen',
    '/showcase/aanmelden',
    '/showcase/wachtwoord-vergeten'
];

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token');
    if (!token && !unProtectedRoutes.includes(event.url.pathname))
        return redirect('/inloggen', 'No authenticated user.');
    // const currentUser = await userRepository.fetch(session as string);

    // if (currentUser) {
    //     event.locals.user = {
    //         isAuthenticated: true,
    //         name: currentUser.name,
    //         email: currentUser.email,
    //         type: currentUser.user_type,
    //         active: currentUser.active,
    //         phone: currentUser.phone
    //     };

    event.locals.user = {
        isAuthenticated: true,
        name: "test user",
        email: "test email",
        role: "Player",
    };
    // } else {
    //     if (!unProtectedRoutes.includes(event.url.pathname)) return redirect('/', 'Not a valid user');
    // }

    return resolve(event);
};