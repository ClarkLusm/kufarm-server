import axios from '../axios.config';

export const listPaymentWallet = () => {
  return axios.get('/wallets').then((res) => res.data);
};

export const createPaymentWallet = (data) => {
  return axios.post('/wallets', data);
};

export const updatePaymentWallet = (id: string, data) => {
  return axios.put(`/wallets/${id}`, data);
};

export const listPaymentAccount = (walletId) => {
  return axios.get(`/wallets/${walletId}/accounts`).then((res) => res.data);
};

export const listSupportedNetworks = () => {
  return axios.get('/wallets/supported-networks').then((res) => res.data);
}
