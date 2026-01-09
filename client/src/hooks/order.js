import { placeOrder, fetchOrders } from '@/services/order';
import { useUserStore } from '@/store/userStore';
import { useMutation, useQuery } from '@tanstack/react-query';

export const usePlaceOrder = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return useMutation({
    mutationKey: ['createOrder'],
    mutationFn: async (orderData) => placeOrder(orderData),
    enabled: isLoggedIn,
    staleTime: Infinity,
  });
};

export const useFetchOrders = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    enabled: isLoggedIn,
  });
};
