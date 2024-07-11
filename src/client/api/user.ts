import axios from 'axios';

export const listUser = () => {
  return axios.get('/users');
};
