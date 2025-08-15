import axios from 'axios';

// Get API base URL from environment or default to relative path
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/backend';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable cookies for session management
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Admin login
  login: async (username: string, password: string) => {
    const response = await apiClient.post('?op=login', { username, password });
    return response.data;
  },

  // Create a new code (admin only)
  createCode: async (ttlSeconds?: number) => {
    const response = await apiClient.post('?op=create_code', { ttlSeconds });
    return response.data;
  },

  // Spin the wheel with a code
  spin: async (code: string) => {
    const response = await apiClient.post('?op=spin', { code });
    return response.data;
  },

  // Get winnings (admin only)
  getWins: async (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    const response = await apiClient.get(`?op=wins&${params.toString()}`);
    return response.data;
  },

  // Logout (admin)
  logout: async () => {
    const response = await apiClient.post('?op=logout');
    return response.data;
  },
};

export default apiService;



