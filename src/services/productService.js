import apiClient from './apiClient.js';

/**
 * Product Service - Handles all product related API calls
 * Base URL: VITE_BACKEND_API_URL + /products
 */

/**
 * Get all products with optional filters
 * @param {Object} params - Query params: { search, category, sort, page, limit, minPrice, maxPrice }
 * @returns {Promise<Object>} - Products list with pagination
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/products', { params });
    // Return clean data: supports both { data: [...] } and { products: [...] } structures
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch products';
    console.error('[getProducts] Error:', message);
    throw new Error(message);
  }
};

/**
 * Get single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} - Single product details
 */
export const getProductById = async (id) => {
  try {
    if (!id) throw new Error('Product ID is required');

    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch product details';
    console.error(`[getProductById: ${id}] Error:`, message);
    throw new Error(message);
  }
};

/**
 * Get featured products for homepage
 * @returns {Promise<Object>} - Featured products list
 */
export const getFeaturedProducts = async () => {
  try {
    const response = await apiClient.get('/products/featured');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch featured products';
    console.error('[getFeaturedProducts] Error:', message);
    throw new Error(message);
  }
};
