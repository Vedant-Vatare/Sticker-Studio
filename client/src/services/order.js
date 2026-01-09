import api from './api.js';

export const placeOrder = async ({ orderItems, shippingAddressId }) => {
  try {
    const response = await api.post('/order/place-order', {
      orderItems,
      shippingAddressId,
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
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
