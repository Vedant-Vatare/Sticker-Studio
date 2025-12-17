import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ShoppingBagIcon,
  Truck,
  RefreshCcw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductDetails, useProductVariant } from '@/hooks/product';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useCartQuery } from '@/hooks/cart';
import ProductOptions from '../product/ProductOptions';
import { Badge } from '../ui/badge';
import ProductInfo from '../product/ProductInformation';
import ProductRecommendations from '../product/ProductRecommendations';
import WishlistButton from '../product/WishlistButton';

const ProductPageSkeleton = () => {
  return (
    <div className="bg-background min-h-screen">
      <main className="241005 mx-auto max-w-7xl px-2 py-2 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <div className="relative flex flex-col gap-4">
            <div className="bg-muted/45 relative flex aspect-square items-center justify-center overflow-hidden rounded-none">
              <Skeleton className="h-full w-full" />
            </div>

            <div className="flex gap-3">
              {[1, 2, 3, 4].map((index) => (
                <Skeleton key={index} className="h-24 w-24 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="relative flex flex-col gap-5">
            <div>
              <Skeleton className="mb-2 h-12 w-3/4" />
            </div>

            <div className="border-b pb-4">
              <div className="flex items-baseline gap-3">
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            <div>
              <Skeleton className="mb-3 h-5 w-20" />
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4].map((index) => (
                  <Skeleton key={index} className="h-9 w-9 rounded-full" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="mb-3 h-5 w-16" />
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((index) => (
                  <Skeleton key={index} className="h-12 w-12 rounded-md" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="flex justify-evenly gap-3 px-2 pt-2">
              <Skeleton className="h-11 flex-1 rounded-sm" />
              <Skeleton className="h-11 flex-1 rounded-sm" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ProductImages = ({ product, variant }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const selectedProduct =
    variant && variant.images.length > 0 ? variant : product;
  const productImages = selectedProduct.images;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length,
    );
  };

  return (
    <div className="relative flex flex-col gap-4">
      <div className="relative flex aspect-square cursor-grabbing items-center justify-center overflow-hidden rounded-sm select-none">
        <img
          src={productImages[currentImageIndex]}
          alt={`Product image ${currentImageIndex + 1}`}
          className="h-full w-full max-w-xs object-contain md:max-w-full"
        />
        {productImages.length > 1 && (
          <>
            <Button
              size={'icon'}
              variant={'ghost'}
              onClick={prevImage}
              className="text-foreground/60 absolute top-1/2 left-1 z-10 -translate-y-1/2 rounded-full p-0 px-1 py-1 transition"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <Button
              size={'icon'}
              variant={'ghost'}
              onClick={nextImage}
              className="text-foreground/60 absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full p-2 transition"
            >
              <ChevronRight className="size-6" />
            </Button>
          </>
        )}
      </div>
      <WishlistButton product={product} />
      <div className="[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1 md:[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        {productImages.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-24 w-24 shrink-0 scale-95 cursor-pointer overflow-hidden rounded-lg border brightness-90 transition ${
              index === currentImageIndex && ' scale-100 brightness-100'
            }`}
          >
            <img
              src={image}
              alt={`View ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProductPage() {
  const { identifier } = useParams();
  const { data: product, isLoading: productLoading } =
    useProductDetails(identifier);
  const { data: productVariantDetails, isLoading: variantLoading } =
    useProductVariant(product?.id);
  const { data: cartItems } = useCartQuery();

  const [selectedOptions, setSelectedOptions] = useState({});

  const groupedOptions = useMemo(() => {
    if (
      !productVariantDetails?.options ||
      productVariantDetails.options.length === 0
    )
      return [];

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

    return productVariantDetails.options
      .reduce((acc, currentOption) => {
        const optionName = currentOption.name;
        const optionIndex = acc.findIndex((opt) => opt.name === optionName);

        if (optionIndex === -1) {
          acc.push({
            name: optionName,
            values: [
              {
                id: currentOption.id,
                value: currentOption.value,
              },
            ],
          });
        } else {
          acc[optionIndex].values.push({
            id: currentOption.id,
            value: currentOption.value,
          });
        }

        return acc;
      }, [])
      .map((option) => {
        if (option.name === 'Size') {
          option.values.sort((a, b) => {
            const indexA = sizeOrder.indexOf(a.value.toUpperCase());
            const indexB = sizeOrder.indexOf(b.value.toUpperCase());
            return indexA - indexB;
          });
        } else {
          option.values.sort((a, b) => a.value.localeCompare(b.value));
        }
        return option;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [productVariantDetails]);

  // populating initial group of options with empty strings
  useEffect(() => {
    if (groupedOptions.length > 0) {
      const initialVariant = {};
      groupedOptions.forEach((option) => (initialVariant[option.name] = ''));
      setSelectedOptions(initialVariant);
    }
  }, [groupedOptions]);

  const selectedvariant = useMemo(() => {
    const optionIds = Object.values(selectedOptions).filter((id) => id !== '');

    if (!productVariantDetails) {
      return null;
    }

    const variantFound = productVariantDetails.variants?.find((variant) => {
      return variant.variant.every((v) => optionIds.includes(v));
    });

    if (!variantFound) {
      return null;
    }

    const containsAllOptions = optionIds.every((id) =>
      variantFound?.variant.includes(id),
    );

    if (!containsAllOptions) {
      return null;
    }

    return variantFound;
  }, [productVariantDetails, selectedOptions]);

  const isVariantAvailable = selectedvariant !== null;

  const handleVariantChange = useCallback((newVariant) => {
    setSelectedOptions(newVariant);
  }, []);

  if (productLoading || variantLoading) {
    return <ProductPageSkeleton />;
  }

  const discount = Math.round(
    ((product.basePrice - product.price) / product.basePrice) * 100,
  );

  return (
    <div className="bg-background min-h-screen">
      <main className="241005 mx-auto max-w-7xl px-2 py-2 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <ProductImages product={product} variant={selectedvariant} />
          <div className="relative flex flex-col gap-3">
            <div>
              {discount > 10 && (
                <Badge
                  className={
                    'bg-success text-success-foreground/90 text-xs font-semibold'
                  }
                >
                  {discount}% OFF
                </Badge>
              )}
              <h1 className="text-foreground font-heading mb-3 text-2xl font-semibold sm:text-2xl">
                {product.name}
              </h1>
            </div>

            <div className="pb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-foreground text-2xl font-bold">
                  ₹{product.price}
                </span>
                {product.basePrice > product.price && (
                  <span className="text-muted-foreground text-xl line-through">
                    ₹{product.basePrice}
                  </span>
                )}
              </div>
            </div>
            <Separator />

            {groupedOptions.map((option) => (
              <ProductOptions
                key={option.name}
                name={option.name}
                values={option.values}
                selectedOptions={selectedOptions}
                setSelectedOptions={handleVariantChange}
              />
            ))}

            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground font-medium">
                {product.stock <= 0 && <b>Out of Stock</b>}
              </span>
            </div>
            {productVariantDetails.options.length > 0 && (
              <div className="relative ml-2 flex items-center">
                <span className="text-destructive tracking-wide">
                  {Object.values(selectedOptions).every((id) => id !== '') &&
                    !isVariantAvailable && (
                      <span className="absolute -top-2 text-sm font-medium">
                        Selected variant is not available
                      </span>
                    )}
                </span>
              </div>
            )}

            <div className="my-2 flex justify-evenly gap-3 px-2">
              <Button className="flex-1 rounded-sm text-base" size="lg">
                Buy Now
              </Button>
              {cartItems?.some((item) => item.product.id === product.id) ? (
                <Button
                  className="bg-muted-foreground/10 flex-1 gap-2 rounded-sm text-base"
                  size="lg"
                  variant={'outline'}
                  asChild
                >
                  <Link to={'/cart'}>View in Cart</Link>
                </Button>
              ) : (
                <Button
                  className="flex-1 gap-2 rounded-sm text-base"
                  size="lg"
                  variant={'outline'}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  Add to Cart
                </Button>
              )}
            </div>
            <Separator />
            <div className="grid grid-cols-2 place-items-start gap-2 text-xs select-none">
              <span>
                <Truck className="bg-muted/50 m-2 size-9 rounded-full p-2" />
                Fast Delivery
              </span>
              <span>
                <RefreshCcw className="bg-muted/50 m-2 size-9 rounded-full p-2" />
                Easy Returns
              </span>

              <span>
                <ShieldCheck className="bg-muted/50 m-2 size-9 rounded-full p-2" />
                Secure Payments
              </span>
              <span>
                <CheckCircle2 className="bg-muted/50 m-2 size-9 rounded-full p-2" />
                Quality product
              </span>
            </div>
          </div>
        </div>
        <ProductInfo
          productId={product?.id}
          variantId={selectedvariant?.id ?? null}
        />
      </main>
      <ProductRecommendations productIds={[product?.id]} />
    </div>
  );
}
