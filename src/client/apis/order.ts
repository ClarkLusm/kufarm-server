import axios from '../axios.config';

export const listOrder = () => {
  return axios.get('/orders').then((res) => res.data);
};
