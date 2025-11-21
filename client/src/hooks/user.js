import { useUserStore } from '@/store/userStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addUserAddress,
  fetchUserAddresses,
  fetchUserProfile,
  removeUserAddress,
  updateUserProfile,
} from '@/services/user';

export const useUserAddresses = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return useQuery({
    queryKey: ['user-addresses'],
    queryFn: fetchUserAddresses,
    refetchOnMount: false,
    enabled: isLoggedIn,
  });
};

export const useAddUserAddress = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['add-user-address'],
    mutationFn: (addressData) => addUserAddress(addressData),
    enabled: isLoggedIn,
    onSuccess: (newAddress) => {
      queryClient.setQueryData(['user-addresses'], (oldAddresses = []) => {
        return [...oldAddresses, newAddress];
      });
    },
  });
};

export const useRemoveUserAddress = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['remove-user-address'],
    mutationFn: (addressId) => removeUserAddress(addressId),
    enabled: isLoggedIn,
    onSuccess: (_, removedId) => {
      queryClient.setQueryData(['user-addresses'], (addresses) => {
        console.log(addresses, removedId);

        return addresses?.filter((ad) => ad != removedId);
      });
    },
  });
};

export const useUserProfile = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
    enabled: isLoggedIn,
  });
};

export const useUpdateUserProfile = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['user-profile'],
    mutationFn: updateUserProfile,
    enabled: isLoggedIn,

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user-profile'], updatedUser);
    },
  });
};
