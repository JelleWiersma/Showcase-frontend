import { getUser, saveUser } from '$lib/server/auth';

export const load = async ({ cookies }) => {
    // update the user cookie if it exists
    const userCookie = cookies.get('user');
    const lastCode = cookies.get('lastCode');
    if(userCookie){
        const user = await getUser(cookies);
        saveUser(user, cookies);
        return {
            user: user,
            lastCode: lastCode
        };
    }

    return;
}