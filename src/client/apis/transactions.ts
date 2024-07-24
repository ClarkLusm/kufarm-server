import axios from '../axios.config';

export const listTransaction = () => {
  return axios.get('/transactions').then(res => res.data);
};
