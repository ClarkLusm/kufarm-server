import axios from '../axios.config';

export const listUser = () => {
  return axios.get('/users').then((res) => res.data);
};
