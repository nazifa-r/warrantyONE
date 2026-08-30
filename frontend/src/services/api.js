import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
};

// Products API calls
// Note: the backend scopes GET /products to the logged-in customer
// automatically (from the JWT), so the customerId argument here is
// optional — kept for API compatibility with existing page code.
export const productAPI = {
  getAll: (customerId) => API.get('/products', { params: customerId ? { customer_id: customerId } : {} }),
  getById: (id) => API.get(`/products/${id}`),
  getBySerial: (serial) => API.get(`/products/serial/${serial}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
  getWarranties: (id) => API.get(`/products/${id}/warranties`),
  getRepairs: (id) => API.get(`/products/${id}/repairs`),
  getBrands: () => API.get('/products/brands'),
  getCategories: () => API.get('/products/categories'),
};

// Customers API calls
export const customerAPI = {
  getAll: () => API.get('/customers'),
  getById: (id) => API.get(`/customers/${id}`),
  create: (data) => API.post('/customers', data),
  update: (id, data) => API.put(`/customers/${id}`, data),
};

// Warranty API calls
export const warrantyAPI = {
  getPlans: () => API.get('/warranties/plans'),
  getPlanById: (id) => API.get(`/warranties/plans/${id}`),
  createPlan: (data) => API.post('/warranties/plans', data),
  updatePlan: (id, data) => API.put(`/warranties/plans/${id}`, data),
  deletePlan: (id) => API.delete(`/warranties/plans/${id}`),
};

// Repairs API calls
export const repairAPI = {
  getAll: () => API.get('/repairs'),
  create: (data) => API.post('/repairs', data),
  updateStatus: (id, status) => API.put(`/repairs/${id}/status`, { status }),
};

export default API;
