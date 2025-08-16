import axios from 'axios';

// Get backend URL from environment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Admin login
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/api/admin/login', { username, password });
    return response.data;
  },

  // Generate a new 5-digit code
  generateCode: async () => {
    const response = await apiClient.get('/api/admin/generate-code');
    return response.data;
  },

  // Verify if a code is valid (from old backend - keeping for compatibility)
  verifyCode: async (code: string) => {
    const response = await apiClient.post('/spin/verify', { code });
    return response.data;
  },

  // Spin the wheel with a code (from old backend - keeping for compatibility)
  spin: async (code: string) => {
    const response = await apiClient.post('/spin/play', { code });
    return response.data;
  },

  // Get all generated codes (from old backend - keeping for compatibility)
  getCodes: async () => {
    const response = await apiClient.get('/admin/codes');
    return response.data;
  },

  // Get spin results (from old backend - keeping for compatibility) 
  getResults: async (limit = 50, offset = 0) => {
    const response = await apiClient.get(`/admin/results?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // Test database connection
  testDatabase: async () => {
    const response = await apiClient.get('/api/db-test');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Legacy compatibility methods
  createCode: async () => {
    return await apiService.generateCode();
  },

  getWins: async () => {
    return await apiService.getResults();
  },

  logout: async () => {
    return { success: true, message: 'Logged out' };
  },
};

export default apiService;



