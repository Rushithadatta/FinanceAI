import axios from 'axios';

// Create axios instance with base URL and default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUserMobile');
      localStorage.removeItem('currentUserName');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Expense API calls
export const expenseAPI = {
  // Get expenses for a specific month and year
  getExpenses: async (year, month) => {
    const response = await api.get(`/expenses/${year}/${month}`);
    return response.data;
  },

  // Add a new expense
  addExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  // Delete an expense
  deleteExpense: async (expenseId) => {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
  },

  // Get annual expenses
  getAnnualExpenses: async (year) => {
    const response = await api.get(`/expenses/annual/${year}`);
    return response.data;
  },
};

// Budget API calls
export const budgetAPI = {
  // Get budget for a specific month and year
  getBudget: async (year, month) => {
    const response = await api.get(`/budgets/${year}/${month}`);
    return response.data;
  },

  // Set budget for a specific month and year
  setBudget: async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  // Delete budget
  deleteBudget: async (year, month) => {
    const response = await api.delete(`/budgets/${year}/${month}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
