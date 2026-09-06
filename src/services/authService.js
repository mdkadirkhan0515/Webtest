import apiClient from './apiClient.js';

/**
 * Auth Service - Handles admin authentication
 */

/**
 * Login admin user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { token, user, message }
 */
export const login = async (credentials) => {
  try {
    if (!credentials?.email ||!credentials?.password) {
      throw new Error('Email and password are required');
    }

    const response = await apiClient.post('/auth/login', credentials);
    const data = response.data;

    const token = data?.token || data?.data?.token || data?.accessToken;
    const user = data?.user || data?.data?.user || data?.admin || null;

    if (!token) throw new Error('No token received from server');

    localStorage.setItem('adminToken', token);
    localStorage.setItem('token', token);
    if (user) localStorage.setItem('adminUser', JSON.stringify(user));

    return { token, user, message: data?.message || 'Login successful' };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    console.error('[login] Error:', message);
    throw new Error(message);
  }
};

/**
 * Logout admin user
 */
export const logout = () => {
  try {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  } catch (error) {
    console.error('[logout] Error:', error.message);
    window.location.href = '/admin/login';
  }
};

/**
 * Get current user profile and token from localStorage
 * @returns {Object|null} - { token, user }
 */
export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const userStr = localStorage.getItem('adminUser');
    if (!token) return null;
    let user = null;
    if (userStr) { try { user = JSON.parse(userStr); } catch { user = null; } }
    return { token, user };
  } catch (error) {
    console.error('[getCurrentUser] Error:', error.message);
    return null;
  }
};

export const isAuthenticated = () =>!!localStorage.getItem('adminToken');
