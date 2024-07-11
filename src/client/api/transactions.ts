import axios from 'axios';

export const listTransaction = () => {
  return axios.get('/transactions');
};
