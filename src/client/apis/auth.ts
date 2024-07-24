import axios from '../axios.config';

export const login = (username, password) => {
  return axios.post('login', {
    username,
    password,
  });
};
