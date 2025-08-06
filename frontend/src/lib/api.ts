// API configuration and service functions
const API_BASE_URL = 'http://localhost:3000/api';

// Auth token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

export const getAuthToken = () => authToken;

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.accessToken) {
      setAuthToken(response.accessToken);
    }
    return response;
  },

  register: async (userData: any) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  logout: () => {
    removeAuthToken();
  },
};

// Users API
export const usersAPI = {
  getUsers: () => apiRequest('/users'),
  getUser: (id: string) => apiRequest(`/users/${id}`),
  createUser: (userData: any) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  updateUser: (id: string, userData: any) => apiRequest(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  deleteUser: (id: string) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Customers API
export const customersAPI = {
  getCustomers: () => apiRequest('/customers'),
  getCustomer: (id: string) => apiRequest(`/customers/${id}`),
  createCustomer: (customerData: any) => apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
  updateCustomer: (id: string, customerData: any) => apiRequest(`/customers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(customerData),
  }),
  deleteCustomer: (id: string) => apiRequest(`/customers/${id}`, {
    method: 'DELETE',
  }),
};

// Products API
export const productsAPI = {
  getProducts: () => apiRequest('/products'),
  getProduct: (id: string) => apiRequest(`/products/${id}`),
  createProduct: (productData: any) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  updateProduct: (id: string, productData: any) => apiRequest(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(productData),
  }),
  deleteProduct: (id: string) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
  getLowStockProducts: () => apiRequest('/products/low-stock'),
  updateStock: (id: string, quantity: number) => apiRequest(`/products/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  }),
};

// Companies API
export const companiesAPI = {
  getCompanies: () => apiRequest('/companies'),
  getCompany: (id: string) => apiRequest(`/companies/${id}`),
  createCompany: (companyData: any) => apiRequest('/companies', {
    method: 'POST',
    body: JSON.stringify(companyData),
  }),
  updateCompany: (id: string, companyData: any) => apiRequest(`/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(companyData),
  }),
  deleteCompany: (id: string) => apiRequest(`/companies/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  getOrders: () => apiRequest('/orders'),
  getOrder: (id: string) => apiRequest(`/orders/${id}`),
  createOrder: (orderData: any) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  updateOrder: (id: string, orderData: any) => apiRequest(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(orderData),
  }),
  deleteOrder: (id: string) => apiRequest(`/orders/${id}`, {
    method: 'DELETE',
  }),
};

// Quotes API
export const quotesAPI = {
  getQuotes: () => apiRequest('/quotes'),
  getQuote: (id: string) => apiRequest(`/quotes/${id}`),
  createQuote: (quoteData: any) => apiRequest('/quotes', {
    method: 'POST',
    body: JSON.stringify(quoteData),
  }),
  updateQuote: (id: string, quoteData: any) => apiRequest(`/quotes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(quoteData),
  }),
  deleteQuote: (id: string) => apiRequest(`/quotes/${id}`, {
    method: 'DELETE',
  }),
};

// Invoices API
export const invoicesAPI = {
  getInvoices: () => apiRequest('/invoices'),
  getInvoice: (id: string) => apiRequest(`/invoices/${id}`),
  createInvoice: (invoiceData: any) => apiRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoiceData),
  }),
  updateInvoice: (id: string, invoiceData: any) => apiRequest(`/invoices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(invoiceData),
  }),
  deleteInvoice: (id: string) => apiRequest(`/invoices/${id}`, {
    method: 'DELETE',
  }),
};

// Payments API
export const paymentsAPI = {
  getPayments: () => apiRequest('/payments'),
  getPayment: (id: string) => apiRequest(`/payments/${id}`),
  createPayment: (paymentData: any) => apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
  updatePayment: (id: string, paymentData: any) => apiRequest(`/payments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(paymentData),
  }),
  deletePayment: (id: string) => apiRequest(`/payments/${id}`, {
    method: 'DELETE',
  }),
};

// Sales API
export const salesAPI = {
  getSales: () => apiRequest('/sales'),
  getSale: (id: string) => apiRequest(`/sales/${id}`),
  createSale: (saleData: any) => apiRequest('/sales', {
    method: 'POST',
    body: JSON.stringify(saleData),
  }),
  updateSale: (id: string, saleData: any) => apiRequest(`/sales/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(saleData),
  }),
  deleteSale: (id: string) => apiRequest(`/sales/${id}`, {
    method: 'DELETE',
  }),
};

export default {
  auth: authAPI,
  users: usersAPI,
  customers: customersAPI,
  products: productsAPI,
  companies: companiesAPI,
  orders: ordersAPI,
  quotes: quotesAPI,
  invoices: invoicesAPI,
  payments: paymentsAPI,
  sales: salesAPI,
};

