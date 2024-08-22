import axios from 'axios';

import { EventBus } from './common/event-bus';
import { getAuth, tokenIsExpired } from './common/helpers/auth.helper';

const axiosSetup = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/admin',
  headers: {
    Accept: 'application/json',
    "Access-Control-Allow-Origin": "*"
  },
});

axiosSetup.interceptors.request.use(
  (config: { headers: { Authorization: string }; url: string }) => {
    const auth = getAuth();
    if (auth && auth.accessToken) {
      if (tokenIsExpired(auth.accessToken)) {
        EventBus.emit('logout');
      }
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  },
  (err: any) => Promise.reject(err),
);

axiosSetup.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        EventBus.emit('logout');
        return Promise.reject();
      } catch (err) {
        console.error('Error signing out:', err);
      }
      return axiosSetup(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default axiosSetup;
