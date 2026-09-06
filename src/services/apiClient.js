import axios from 'axios';

/**
 * Central Axios instance for the entire application
 * Base URL is loaded from .env file
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout for Vercel cold starts
});

// ================= REQUEST INTERCEPTOR =================
// Automatically attach JWT token from localStorage to every request
apiClient.interceptors.request.use(
  (config) => {
    // Support both user and admin tokens
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request setup errors
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================
// Global error handler for API responses
apiClient.interceptors.response.use(
  (response) => {
    // If success, just return response
    return response;
  },
  (error) => {
    // Network error (backend down, no internet)
    if (!error.response) {
      console.error('[API Error] Network Error:', error.message);
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle specific status codes globally
    switch (status) {
      case 401:
        console.error('[API Error] 401 Unauthorized:', data?.message || 'Invalid or expired token');
        // Optional: Auto logout on 401
        // localStorage.removeItem('token');
        // localStorage.removeItem('adminToken');
        // window.location.href = '/admin/login';
        break;
      
      case 403:
        console.error('[API Error] 403 Forbidden:', data?.message || 'You do not have permission');
        break;

      case 404:
        console.error('[API Error] 404 Not Found:', data?.message || 'Resource not found');
        break;

      case 500:
        console.error('[API Error] 500 Server Error:', data?.message || 'Internal server error');
        break;

      default:
        console.error(`[API Error] ${status}:`, data?.message || error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
