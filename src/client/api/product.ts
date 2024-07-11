import axios from 'axios';
import { IProduct } from '../common/interfaces/product.interface';

export const listProduct = () => {
  return axios.get('/products');
};

export const detailProduct = (id: string) => {
  return axios.get(`/products/${id}`);
};

export const createProduct = (data: IProduct) => {
  return axios.post('/products', data);
};
