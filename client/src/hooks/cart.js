import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addProductToCart,
  fetchUserCart,
  removeProductFromCart,
  updateProductInCart,
} from '../services/product/cart';
import { toast } from 'sonner';

export const useCartQuery = () => {
  return useQuery({
    queryKey: ['cart'],
    enabled: !!localStorage.getItem('token'),
    queryFn: fetchUserCart,
    staleTime: Infinity,
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['cart'],
    mutationFn: addProductToCart,

    onSuccess: (newCartItem) => {
      queryClient.setQueryData(['cart'], (old = {}) => {
        return {
          ...old,
          cartItems: [...old.cartItems, newCartItem],
        };
      });
    },

    onError: (error) => {
      console.error('Failed to add to cart:', error);
      toast.error('failed to add to cart');
    },
  });
};

export const useUpdateCartItemQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['cart'],
    mutationFn: updateProductInCart,

    onMutate: async ({ cartItemId, updatedQuantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      const previousCart = queryClient.getQueryData['cart'];

      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return old;

        return {
          ...old,
          cartItems: old.cartItems.map((item) =>
            item.id === cartItemId
              ? { ...item, quantity: updatedQuantity }
              : item,
          ),
        };
      });

      return { previousCart };
    },

    onError: (_error, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
  });
};

export const useDeleteCartItemQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['cart'],
    mutationFn: removeProductFromCart,

    onMutate: async (cartItemId) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      const previousCart = queryClient.getQueryData['cart'];

      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return old;

        return {
          ...old,
          cartItems: old.cartItems.filter((item) => item.id !== cartItemId),
        };
      });

      return { previousCart };
    },

    onError: (_error, _cartItemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },
  });
};
