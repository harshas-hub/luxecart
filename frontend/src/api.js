import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxecart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// ---- Products ----
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);

// ---- Categories ----
export const getCategories = () => API.get('/categories');

// ---- Cart ----
export const getCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart/items', data);
export const updateCartItem = (id, data) => API.put(`/cart/items/${id}`, data);
export const removeCartItem = (id) => API.delete(`/cart/items/${id}`);
export const clearCart = () => API.delete('/cart');

// ---- Orders ----
export const createOrder = (data) => API.post('/orders', data);
export const getOrders = () => API.get('/orders');

export default API;