import axiosInstance from './api.js';

export const fetchUserAddresses = async () => {
  const response = await axiosInstance.get('/user/address/all', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data.addresses;
};

export const addUserAddress = async (addressData) => {
  const response = await axiosInstance.post('/user/address/', addressData);
  return response.data.userAddress;
};

export const removeUserAddress = async (addressId) => {
  const response = await axiosInstance.delete(`/user/address/${addressId}`);
  return response.data;
};

export const updateUserAddress = async (address) => {
  const response = await axiosInstance.patch(`/user/address/${address.id}`, {
    address,
  });
  return response.data.address;
};

export const fetchUserProfile = async () => {
  const response = await axiosInstance.get('/user/profile', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data.user;
};

export const updateUserProfile = async (data) => {
  const response = await axiosInstance.post('/user/profile', data);
  return response.data.user;
};
