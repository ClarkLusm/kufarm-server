import axios from '../axios.config';
import { IProduct } from '../common/interfaces/product.interface';

export const listProduct = () => {
  return axios.get('/products?sort=price').then((res) => res.data);
};

export const detailProduct = (id: string) => {
  return axios.get(`/products/${id}`).then((res) => res.data);
};

export const createProduct = (data: IProduct) => {
  return axios.post('/products', data);
};

export const updateProduct = (id: string, data: IProduct) => {
  return axios.put(`/products/${id}`, data);
};
