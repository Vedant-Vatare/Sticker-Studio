import api from './api.js';

export const createOrder = async ({ orderItems, shippingAddressId }) => {
  const response = await api.post('/order/create-order', {
    orderItems,
    shippingAddressId,
  });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/order/verify-order', paymentData);
  return response.data;
};
export const cancelOrder = async (orderId) => {
  const response = await api.post('/order/cancel-order', { orderId });
  return response.data;
};

export const fetchOrders = async () => {
  const response = await api.get('/order', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data.orders;
};
