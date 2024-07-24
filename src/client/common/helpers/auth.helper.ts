'use client';

import { jwtDecode } from 'jwt-decode';
import { IAuth } from '../interfaces/auth.interface';

const AUTH_LOCAL_STORAGE_KEY = 'auth';

const getAuth = (): IAuth | undefined => {
  if (typeof window === 'undefined') {
    return;
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }

  try {
    const auth: IAuth = JSON.parse(lsValue) as IAuth;
    if (auth) {
      if (tokenIsExpired(auth.accessToken)) {
        localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
        return;
      }
      return auth;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = (auth: IAuth) => {
  if (!localStorage) {
    console.error('localStorage unavailable');
    return;
  }

  try {
    const lsValue = JSON.stringify(auth);
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
  }
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

const tokenIsExpired = (token) => {
  const decode = jwtDecode(token);
  return decode?.exp! * 1000 < new Date().getTime();
};

export { getAuth, setAuth, removeAuth, tokenIsExpired, AUTH_LOCAL_STORAGE_KEY };
