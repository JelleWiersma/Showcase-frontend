import { getUser, saveUser } from '$lib/server/auth';

export const load = async ({ cookies }) => {
    // update the user cookie if it exists
    const userCookie = cookies.get('user');
    if(userCookie){
        const user = await getUser(cookies);
        saveUser(user, cookies);
        return {
            user: user
        };
    }

    return;
}