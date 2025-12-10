import { useNavigate } from 'react-router-dom';
import { useProductRecommendations } from '@/hooks/product';
import ProductGrid from './ProductGrid';
import { Skeleton } from '../ui/skeleton';

const SkeletonComponent = () => {
  return (
    <div className="bg-background min-h-screen pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-foreground page-title mb-5">Shopping Cart</h1>
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-3xl flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className="border-border overflow-hidden border py-4"
              >
                <div className="flex gap-4 p-4 sm:flex-row sm:gap-6">
                  <Skeleton className="h-24 w-24 rounded-lg sm:h-32 sm:w-32" />
                  <div className="flex flex-1 flex-col justify-start gap-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex flex-col items-end justify-between gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductRecommendations = ({ productIds, categorySlug, heading }) => {
  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const { data: similarProductsData, isLoading: isLoadingSimilar } =
    useProductRecommendations({
      productIds: productIds || [],
      categorySlugs: categorySlug || [],
      limit: 12,
    });
  const similarProducts = similarProductsData?.map(
    (productData) => productData.product,
  );

  if (similarProducts?.length > 0) {
    return (
      <div className="mt-10">
        <h2 className="mb-2 text-center text-xl lg:mb-4">
          {heading ? heading : 'You might also like'}
        </h2>
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-5xl flex-col gap-2">
            {isLoadingSimilar ? (
              <SkeletonComponent />
            ) : (
              <>
                <ProductGrid
                  products={similarProducts}
                  showAddToCartBtn={true}
                  onClick={handleProductClick}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProductRecommendations;
