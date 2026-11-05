import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getProducts = () => api.get('/products');
export const createOrder = (orderData) => api.post('/orders', orderData);