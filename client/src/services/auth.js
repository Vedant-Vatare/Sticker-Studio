import axios from './api.js';

export const sendCodeToemail = async (email) => {
  const response = await axios.get('/user/send-verification-code', {
    params: { email },
  });
  return response.data;
};

export const verifyEmailCode = async ({ email, code }) => {
  const response = await axios.get('/user/verify-email-code', {
    params: { email, code },
  });
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await axios.post('/user/login', { email, password });
  return response.data;
};

export const createUserAccount = async ({ password }) => {
  const response = await axios.post(
    '/user/create-user',
    { password },
    {
      headers: {
        userauthtoken: localStorage.getItem('userauthtoken'),
      },
    },
  );
  return response.data;
};
