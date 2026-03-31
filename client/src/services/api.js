import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

// ── Active Products ──
export const getProducts = () => API.get('/products');
export const addProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ── Recycle Bin ──
export const getDeletedProducts = () => API.get('/products/deleted');
export const restoreProduct = (id) => API.put(`/products/${id}/restore`);