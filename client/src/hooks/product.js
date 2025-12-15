import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getProductDetails,
  getProductDimensions,
  getProductRecommendations,
  getProductSpecifications,
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

export const useProductDetails = (productId) => {
  return useQuery({
    queryKey: ['product-details', { productId }],
    queryFn: () => getProductDetails(productId),
    staleTime: Infinity,
  });
};

export const useProductVariant = (productId) => {
  return useQuery({
    queryKey: ['product-variant', { productId }],
    queryFn: () => getProductvariant(productId),
    staleTime: Infinity,
    enabled: !!productId,
  });
};

export const useProductSpecs = (productId) => {
  return useQuery({
    queryKey: ['product-specs', productId],
    queryFn: () => getProductSpecifications(productId),
    staleTime: Infinity,
    enabled: !!productId,
  });
};

export const useProductDimensions = (productId) => {
  return useQuery({
    queryKey: ['product-dimensions', productId],
    queryFn: () => getProductDimensions(productId),
    staleTime: Infinity,
    enabled: !!productId,
  });
};
