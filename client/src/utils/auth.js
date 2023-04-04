import Cookies from 'js-cookie';
import { COOKIES_TOKEN, EXPIRATION } from './constants';

export const saveTokenToStorage = (token, options = {}) => {
    token ? Cookies.set(COOKIES_TOKEN.name, token, options) : Cookies.set(COOKIES_TOKEN.name, null, options);
};

export const getTokenFromStorage = () => Cookies.get(COOKIES_TOKEN.name);

export const removeUserFromStorage = () => Cookies.remove(COOKIES_TOKEN.name);

export const setTokenCookies = (token) => {
    if (process.env.NODE_ENV === 'development') {
        saveTokenToStorage(token);
    } else {
        saveTokenToStorage(token, {
            path: '/',
            expires: EXPIRATION,
            domain: COOKIES_TOKEN.domain,
            sameSite: 'Strict',
            secure: true,
        });
    }
};
