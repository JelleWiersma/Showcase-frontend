//@ts-nocheck
export function getCookieValue(cookies, name) {
    const cookie = cookies.split(';').find(cookie => cookie.trim().startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : '';
}