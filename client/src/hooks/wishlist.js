import {
  addProductToWishlist,
  fetchWishlist,
  removeProductFromWishlist,
} from '@/services/product/wishlist';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['add-to-wishlist'],
    mutationFn: addProductToWishlist,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previousWishlist = queryClient.getQueryData(['wishlist']);

      queryClient.setQueryData(['wishlist'], (wishlistItems = []) => {
        const exists = wishlistItems.find(
          (item) => item.productId === productId,
        );
        if (exists) return wishlistItems;

        return [...wishlistItems, { productId }];
      });

      return { previousWishlist };
    },

    onSuccess: (data, productId, context) => {
      queryClient.setQueryData(['wishlist'], (old = []) => {
        return old.map((item) =>
          item.productId === productId ? { ...item, ...data } : item,
        );
      });
    },

    onError: (err, productId, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
      }
    },
  });
};

export const useWishlistQuery = () => {
  return useQuery({
    queryKey: ['wishlist'],
    enabled: !!localStorage.getItem('token'),
    queryFn: fetchWishlist,
    staleTime: Infinity,
  });
};

export const useIsProductInWishlist = (productId) => {
  const { data: wishlistItems } = useWishlistQuery();

  return useMemo(() => {
    if (!wishlistItems) {
      return { isPending: true, inWishlist: undefined };
    }

    const foundItem = wishlistItems.some(
      (item) => item.productId === productId,
    );

    return foundItem
      ? { isPending: false, inWishlist: true }
      : { isPending: false, inWishlist: false };
  }, [wishlistItems, productId]);
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['remove-from-wishlist'],
    mutationFn: removeProductFromWishlist,

    onMutate: (productId) => {
      queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previousWishlist = queryClient.getQueryData(['wishlist']);

      queryClient.setQueryData(['wishlist'], (wishlist) => {
        return wishlist.filter((item) => item.productId !== productId);
      });

      return previousWishlist;
    },

    onSuccess: (data, productId, context) => {
      queryClient.setQueryData(['wishlist'], (wishlist) => {
        return wishlist.map((item) =>
          item.productId === productId ? { ...item, ...data } : item,
        );
      });
    },

    onError: (error, productId, context) => {
      console.log(error);
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
      }
    },
  });
};
