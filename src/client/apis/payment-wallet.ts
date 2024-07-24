import axios from '../axios.config';

export const listPaymentWallet = () => {
  return axios.get('/wallets').then((res) => res.data);
};
