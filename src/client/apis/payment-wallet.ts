import axios from '../axios.config';

export const listPaymentWallet = () => {
  return axios.get('/wallets').then((res) => res.data);
};

export const listPaymentAccount = (walletId) => {
  return axios.get(`/wallets/${walletId}/accounts`).then((res) => res.data);
};
