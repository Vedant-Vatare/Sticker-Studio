import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getProductRecommendations,
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
