import axios from '../api.js';

export const addProductToWishlist = async (productId) => {
  const response = await axios.post('/wishlist/add', { productId });
  return response.data.wishlistItem;
};

export const fetchWishlist = async () => {
  const response = await axios.get('/wishlist', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return response.data.wishlist;
};

export const removeProductFromWishlist = async (productId) => {
  const response = await axios.delete(`/wishlist/${productId}`);
  return response.data;
};
