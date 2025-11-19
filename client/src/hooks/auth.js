import {
  createUserAccount,
  loginUser,
  sendCodeToemail,
  verifyEmailCode,
} from '@/services/auth';
import { useMutation } from '@tanstack/react-query';
import {
  useAuthTimeoutStore,
  useMailVerificationStore,
} from '@/store/userStore';

export const sendEmailCodeMutation = () => {
  return useMutation({
    mutationKey: ['send-verification-code'],
    mutationFn: (email) => sendCodeToemail(email),

    onSuccess: (_, email) => {
      const { setVerificationEmail } = useMailVerificationStore.getState();
      const { setResendTimeout } = useAuthTimeoutStore.getState();

      setVerificationEmail(email);
      setResendTimeout();
    },
  });
};

export const verifyEmailMutation = () => {
  return useMutation({
    mutationKey: ['verify-email-code'],
    mutationFn: ({ email, code }) => verifyEmailCode({ email, code }),
  });
};

export const loginUserMutation = () => {
  return useMutation({
    mutationKey: ['login-user'],
    mutationFn: ({ email, password }) => loginUser({ email, password }),
  });
};
export const createUserAccountMutation = () => {
  return useMutation({
    mutationKey: ['create-user-account'],
    mutationFn: ({ password }) => createUserAccount({ password }),
  });
};
