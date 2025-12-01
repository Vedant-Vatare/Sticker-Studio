import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useSearchProducts } from '@/hooks/product';
import { Skeleton } from '../ui/skeleton';
import ProductGrid from '../product/ProductGrid';
import { Button } from '../ui/button';
import { toast } from 'sonner';

import { SearchX } from 'lucide-react';

const ProductSearch = () => {
  const { query } = useParams();
  const {
    data: searchedProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useSearchProducts({ query, limit: 20 });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div className="mb-8">
          <h1 className="page-title">{query}</h1>
        </motion.div>
        <div className="grid w-full grid-cols-2 justify-items-center gap-2 gap-y-7 sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex w-full flex-col space-y-2 p-2">
              <div className="aspect-square w-full">
                <Skeleton className="h-full w-full rounded-md" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-7 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    toast.error(error.response.data.message || 'something went wrong');
  }

  const products = searchedProducts?.pages.flatMap((batch) => batch);
  if (products.length > 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div>
          <h1 className="page-title">{query}</h1>
        </motion.div>
        <ProductGrid products={products} showAddToCartBtn={true} />
        {hasNextPage && (
          <Button
            className={'mt-5 rounded-sm p-3 px-4 text-base'}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-muted/40 mt-10 flex flex-col items-center rounded-md p-10 text-center">
          <div className="bg-muted text-muted-foreground/50 mb-4 grid h-16 w-16 place-items-center rounded-full">
            <SearchX className="h-8 w-8" />
          </div>
          <p className="font-heading text-xl font-semibold tracking-wide">
            No results found for <b>{query}</b>
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Try adjusting your search keywords
          </p>
        </div>
      </div>
    );
  }
};

export default ProductSearch;
