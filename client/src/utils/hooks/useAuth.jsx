import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
const AuthContext = createContext();

import { getUser } from 'api/user/user';
import { loginService, logoutService } from 'api/auth/auth';

import { ROLES } from 'utils/constants';
import { getTokenFromStorage, removeUserFromStorage, setTokenCookies } from 'utils/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const authenticated = useMemo(() => user !== null, [user]);
    const isAdmin = useMemo(() => authenticated && user?.role?.name === ROLES.admin, [authenticated]);

    const initAuth = () => (getTokenFromStorage() ? getUser() : Promise.resolve(null));

    // Call this function to sign out logged in user
    const logout = () => {
        if (user) {
            logoutService();
            removeUserFromStorage();

            return initAuth()
                .then((response) => {
                    setUser(response?.data ? response.data : response);

                    return 'logged out';
                })
                .catch((e) => Promise.reject(e));
        }
    };

    // Call this function when you want to authenticate the user
    const login = (username, password) =>
        loginService(username, password).then((response) => {
            if (response?.data.token) {
                setTokenCookies(response?.data.token);

                initAuth()
                    .then((response) => setUser(response?.data ? response.data : response))
                    .catch(() => logout());
            }

            return response;
        });

    const authByToken = (token) => {
      if(token) {
        setTokenCookies(token);

        initAuth()
          .then((response) => setUser(response?.data ? response.data : response))
          .catch(() => logout());
      }
    }

    useEffect(() => {
        initAuth()
            .then((response) => setUser(response?.data ? response.data : response))
            .catch(() => setUser(null))
            .finally(() => setInitializing(false));
    }, []);

    const value = useMemo(
        () => ({
            user,
            authenticated,
            isAdmin,
            login,
            authByToken,
            logout,
            initializing,
        }),
        [user, initializing],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
