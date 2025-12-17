import { useWishlistQuery } from '@/hooks/wishlist';
import { motion } from 'motion/react';
import ProductGrid from '../product/ProductGrid';
import { Skeleton } from '../ui/skeleton';
import { useMemo } from 'react';

const WishlistPage = () => {
  const { data: wishlistItems, isPending } = useWishlistQuery();

  const wishlistedProducts = useMemo(() => {
    if (!wishlistItems || wishlistItems.length === 0) return null;
    return wishlistItems.map((item) => item.product);
  }, [wishlistItems]);

  if (isPending) {
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
    </div>;
  }

  if (wishlistedProducts?.length > 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div>
          <h1 className="page-title">My Wishlist</h1>
        </motion.div>
        <ProductGrid
          products={wishlistedProducts}
          showAddToCartBtn={true}
          showWishlistBtn={true}
        />
      </div>
    );
  }
};

export default WishlistPage;
