import Client from 'api/client/client';

export const loginService = (email, password) =>
  Client({
    url: 'login',
    method: 'POST',
    data: {
      email,
      password,
    },
  });

export const logoutService = () =>
  Client({
    url: 'logout',
    method: 'POST',
  });
