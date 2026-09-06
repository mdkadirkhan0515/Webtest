import apiClient from './apiClient.js';

/**
 * Create a new order (Customer Checkout)
 * @param {Object} orderData - { items, shippingAddress, totalAmount, paymentMethod }
 */
export const createOrder = async (orderData) => {
  try {
    if (!orderData ||!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to create order';
    console.error('[createOrder] Error:', message);
    throw new Error(message);
  }
};

/**
 * Get all orders for admin management
 * @param {Object} params - { status, page, limit }
 */
export const getAllOrders = async (params = {}) => {
  try {
    const endpoint = '/orders/admin';
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      try {
        const fallbackResponse = await apiClient.get('/orders', { params });
        return fallbackResponse.data;
      } catch (fallbackError) {
        const message = fallbackError.response?.data?.message || fallbackError.message || 'Failed to fetch orders';
        throw new Error(message);
      }
    }
    const message = error.response?.data?.message || error.message || 'Failed to fetch orders';
    console.error('[getAllOrders] Error:', message);
    throw new Error(message);
  }
};

/**
 * Update order status (Admin only)
 * @param {string} orderId - Order ID
 * @param {string} status - pending, processing, shipped, delivered, cancelled
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    if (!orderId) throw new Error('Order ID is required');
    if (!status) throw new Error('Status is required');
    const response = await apiClient.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to update order status';
    console.error(`[updateOrderStatus: ${orderId}] Error:`, message);
    throw new Error(message);
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    if (!orderId) throw new Error('Order ID is required');
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch order';
    throw new Error(message);
  }
};
