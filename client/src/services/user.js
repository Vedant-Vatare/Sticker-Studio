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
  const response = await axiosInstance.post('/user/profile', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data.user;
};
