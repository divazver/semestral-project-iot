import Client from "../client/client";

export const getUser = () =>
  Client({
    url: `current-user`,
  });

export const registerUser = (user) =>
  Client({
    method: 'POST',
    url: `user/register`,
    data: user,
  });
