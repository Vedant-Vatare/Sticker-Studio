import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getProductDetails,
  getProductRecommendations,
  getProductvariant,
  searchProductsByQuery,
} from '@/services/product/product';

export const useProductRecommendations = ({ productIds, categorySlugs }) => {
  return useQuery({
    queryKey: ['product-recommendations', { productIds, categorySlugs }],
    queryFn: () => getProductRecommendations({ productIds, categorySlugs }),
  });
};

export const useSearchProducts = ({ query, limit = 20 }) => {
  return useInfiniteQuery({
    queryKey: ['product-search', query],
    enabled: !!query,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: ({ pageParam }) =>
      searchProductsByQuery({
        query,
        limit,
        offset: pageParam,
      }),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
  });
};

export const useProductDetails = (id) => {
  return useQuery({
    queryKey: ['product-details', { id }],
    queryFn: () => getProductDetails(id),
    staleTime: Infinity,
  });
};

export const useProductVariant = (id) => {
  return useQuery({
    queryKey: ['product-variant', { id }],
    queryFn: () => getProductvariant(id),
    staleTime: Infinity,
  });
};
