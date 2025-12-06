import axios from '../api';

export async function fetchProductsByCollection(collectionSlug) {
  const response = await axios.get('/product/collection', {
    params: { categorySlug: collectionSlug },
  });
  return response.data.products;
}

export async function getProductRecommendations({ productIds, categorySlugs }) {
  if (productIds.length === 0 && categorySlugs.length === 0) {
    return [];
  }
  const response = await axios.get('/product/recommendations', {
    params: { productId: productIds, categorySlug: categorySlugs },
  });
  return response.data.recommendations;
}

export async function searchProductsByQuery({ query, limit, offset }) {
  const response = await axios.get(
    `/product/search?q=${query}&limit=${limit}&offset=${offset}`,
  );

  return response.data.products;
}

export async function getProductDetails(id) {
  const response = await axios.get(`/product/${id}`);
  return response.data.product;
}
export async function getProductvariant(id) {
  const response = await axios.get(`/variant/${id}`);
  return {
    variants: response.data.productVariants,
    options: response.data.options,
  };
}
