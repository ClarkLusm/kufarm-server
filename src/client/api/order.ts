import axios from 'axios';

export const listOrder = () => {
  return axios.get('/orders');
};
