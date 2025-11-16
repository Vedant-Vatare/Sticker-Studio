import { fetchProductsByCollection } from '@/services/product/collection';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ProductGrid from '../product/ProductGrid';
import { motion } from 'motion/react';
import { Skeleton } from '../ui/skeleton';
import { useEffect } from 'react';
import { breadcrumbStore } from '@/store/globalStore';

const ProductsCollection = () => {
  const { collectionSlug } = useParams();
  const {
    data: productsCollection,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products', collectionSlug],
    queryFn: () => fetchProductsByCollection(collectionSlug),
  });
  const setBreadcrumbs = breadcrumbStore((store) => store.setBreadcrumbs);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'home', path: '/' },
      { label: 'shop', path: '/shop' },
      {
        label: collectionSlug.split('-').join(' '),
        path: `/shop/${collectionSlug}`,
      },
    ]);

    return () => setBreadcrumbs([]);
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div className="mb-8">
          <h1 className="page-title">
            Shop {collectionSlug.split('-').join(' ')}
          </h1>
        </motion.div>
        <div className="grid w-full grid-cols-2 justify-items-center gap-2 gap-y-7 sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex w-full flex-col space-y-3 p-2">
              <div className="aspect-square w-full">
                <Skeleton className="h-full w-full rounded-md" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (isError) {
    return <div>Error loading products.</div>;
  }

  const products = productsCollection.map((productCollection) => ({
    ...productCollection.product,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div>
        <h1 className="page-title">
          Shop {collectionSlug.split('-').join(' ')}
        </h1>
      </motion.div>
      <ProductGrid products={products} showAddToCartBtn={true} />
    </div>
  );
};

export default ProductsCollection;
