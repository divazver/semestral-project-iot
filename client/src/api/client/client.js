import axios from 'axios';
import Cookies from 'js-cookie';

import { API_TIMEOUT, COOKIES_TOKEN } from 'utils/constants';

const Client = (options) => {
  const token = Cookies.get(COOKIES_TOKEN.name);

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['authorization'] = `Bearer ${token}`;
  }

  const config = {
    baseURL: process.env.REACT_APP_SERVER_API_URL,
    headers,
    timeout: API_TIMEOUT,
  };

  const client = axios.create(config);

  return client(options);
};

export default Client;
