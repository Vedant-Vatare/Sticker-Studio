import { useUserStore } from '@/store/userStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addUserAddress,
  fetchUserAddresses,
  fetchUserProfile,
  removeUserAddress,
  updateUserAddress,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['remove-user-address'],
    mutationFn: (addressId) => removeUserAddress(addressId),
    onSuccess: (_, removedId) => {
      queryClient.setQueryData(['user-addresses'], (addresses) => {
        return addresses?.filter((ad) => ad.id != removedId);
      });
    },
  });
};

export const useUpdateUserAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-user-address'],
    mutationFn: updateUserAddress,

    onSuccess: (updatedAddress) => {
      queryClient.setQueryData(['user-addresses'], (oldAddresses = []) => {
        return oldAddresses.map((addr) => {
          if (addr.id === updatedAddress.id) {
            return { ...addr, ...updatedAddress };
          }

          if (updatedAddress.isDefault && addr.isDefault) {
            return { ...addr, isDefault: false };
          }

          return addr;
        });
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
