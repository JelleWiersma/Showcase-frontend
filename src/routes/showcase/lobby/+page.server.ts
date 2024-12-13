import { goto } from '$app/navigation';

export const load = async ({ cookies, url }) => {
    // Get the 'c' parameter from the URL
    const cParam = url.searchParams.get('c');

    // update the user cookie if it exists
    const userCookie = cookies.get('user');
    if(userCookie){
        const user = JSON.parse(userCookie);
        return {
            token: cookies.get('token'),
            user: user,
            code: cParam
        };
    }

    goto('/showcase/inloggen');
}