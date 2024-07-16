import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { EventBus } from './common/event-bus';
import { getAuth } from './common/helpers/auth.helper';

export function setupAxios() {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string }; url: string }) => {
      const auth = getAuth();
      if (auth && auth.token) {
        const token = jwtDecode(auth.token);
        if (token?.exp! * 1000 < new Date().getTime()) {
          EventBus.emit('logout');
        }
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
      if (config.url && config.url.indexOf('http') < 0) {
        config.url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/${config.url}`;
      }
      return config;
    },
    (err: any) => Promise.reject(err),
  );
}
