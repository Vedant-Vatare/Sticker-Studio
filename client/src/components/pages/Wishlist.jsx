import { useWishlistQuery } from '@/hooks/wishlist';
import { motion } from 'motion/react';
import ProductGrid from '../product/ProductGrid';
import { Skeleton } from '../ui/skeleton';
import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { data: wishlistItems, isLoading } = useWishlistQuery();

  const wishlistedProducts = useMemo(() => {
    if (!wishlistItems || wishlistItems.length === 0) return null;
    return wishlistItems.map((item) => item.product);
  }, [wishlistItems]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div>
          <h1 className="page-title">My Wishlist</h1>
        </motion.div>
        <div className="grid w-full grid-cols-2 justify-items-center gap-2 gap-y-7 sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
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

  if (wishlistItems?.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-muted/40 mt-10 flex flex-col items-center rounded-md p-10 text-center">
          <div className="bg-muted text-muted-foreground/50 mb-4 grid h-16 w-16 place-items-center rounded-full">
            <Heart className="h-8 w-8" />
          </div>
          <p className="font-heading text-xl font-semibold tracking-wide">
            Your wishlist is empty
          </p>

          <Button asChild>
            <Link to={'/shop'} className="mt-5 text-lg tracking-wide">
              Go to Shop
            </Link>
          </Button>
        </div>
      </div>
    );
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
