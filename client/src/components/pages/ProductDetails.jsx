import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductDetails, useProductVariant } from '@/hooks/product';
import { useMemo } from 'react';
import { ShoppingBagIcon } from 'lucide-react';
import { useCartQuery } from '@/hooks/cart';
import { Skeleton } from '../ui/skeleton';
import { create } from 'zustand';
import { useEffect } from 'react';
import { CloudRain } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Truck } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

const ProductPageSkeleton = () => {
  return (
    <div className="bg-background min-h-screen">
      <main className="241005 mx-auto max-w-7xl px-2 py-2 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {/* Image Section Skeleton */}
          <div className="relative flex flex-col gap-4">
            <div className="bg-muted/45 relative flex aspect-square items-center justify-center overflow-hidden rounded-none">
              <Skeleton className="h-full w-full" />
            </div>

            {/* Thumbnail Skeletons */}
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((index) => (
                <Skeleton key={index} className="h-24 w-24 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Details Section Skeleton */}
          <div className="relative flex flex-col gap-5">
            {/* Title Skeleton */}
            <div>
              <Skeleton className="mb-2 h-12 w-3/4" />
            </div>

            {/* Price Skeleton */}
            <div className="border-b pb-4">
              <div className="flex items-baseline gap-3">
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            {/* Options Skeleton - Color */}
            <div>
              <Skeleton className="mb-3 h-5 w-20" />
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4].map((index) => (
                  <Skeleton key={index} className="h-9 w-9 rounded-full" />
                ))}
              </div>
            </div>

            {/* Options Skeleton - Size */}
            <div>
              <Skeleton className="mb-3 h-5 w-16" />
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((index) => (
                  <Skeleton key={index} className="h-12 w-12 rounded-md" />
                ))}
              </div>
            </div>

            {/* Stock Skeleton */}
            <div>
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Buttons Skeleton */}
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

const ShowOptions = ({ name, values, selectedVariant, setSelectedVariant }) => {
  if (name === 'Color') {
    return (
      <div className="ml-2">
        <label className="text-foreground mb-2 block text-base font-medium">
          Colors
        </label>
        <div className="flex flex-wrap gap-3">
          {values.map((color) => (
            <button
              key={color.id}
              onClick={() =>
                setSelectedVariant((variant) => ({
                  ...variant,
                  Color: color.id,
                }))
              }
              className={`relative h-9 w-9 rounded-full border transition ${
                selectedVariant.Color === color.id
                  ? 'border-primary scale-110'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.value}
            >
              {selectedVariant.Color === color.id && (
                <Check className="text-foreground absolute inset-0 m-auto h-5 w-5" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ml-2">
      <label className="text-foreground mb-3 block text-base font-medium capitalize">
        {name}
      </label>
      <div className="flex flex-wrap gap-3">
        {values.map((option) => (
          <Button
            size={'icon'}
            variant={'outline'}
            className={`size-10 text-sm ${
              selectedVariant[name] === option.id
                ? 'border-primary scale-110'
                : 'border-border hover:border-primary/50'
            }`}
            key={option.id}
            onClick={() =>
              setSelectedVariant((variant) => ({
                ...variant,
                [name]: option.id,
              }))
            }
            title={option.value}
          >
            {option.value}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default function ProductPage() {
  const { productId } = useParams();
  const { data: product, isLoading: productLoading } =
    useProductDetails(productId);
  const { data: variantDetails, isLoading: variantLoading } =
    useProductVariant(productId);
  const { data: cartItems } = useCartQuery();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(true);
  const [isVariantAvailable, setIsVariantAvailable] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState({});

  const groupedOptions = useMemo(() => {
    if (!variantDetails?.options || variantDetails.options.length === 0)
      return [];

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

    return variantDetails.options
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
  }, [variantDetails]);

  useEffect(() => {
    if (groupedOptions.length > 0) {
      const initialVariant = {};
      groupedOptions.forEach((option) => (initialVariant[option.name] = ''));
      setSelectedVariant(initialVariant);
    }
  }, [groupedOptions]);
  const getSelectedVariantDetails = useMemo(() => {
    const variantIds = Object.values(selectedVariant);

    if (!variantDetails || variantIds.some((id) => id === '')) {
      return null;
    } else {
      const variantFound = variantDetails.variants?.find((variantDetails) => {
        return variantDetails.variant.every((v, i) => {
          return variantIds.includes(v);
        });
      });
      variantFound ? setIsVariantAvailable(false) : setIsVariantAvailable(true);
    }
  }, [variantDetails, selectedVariant]);

  if (productLoading || variantLoading) {
    return <ProductPageSkeleton />;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <div className="bg-background min-h-screen">
      <main className="241005 mx-auto max-w-7xl px-2 py-2 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <div className="relative flex flex-col gap-4">
            <div className="bg-muted/45 relative flex aspect-square cursor-grabbing items-center justify-center overflow-hidden rounded-none select-none">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="h-full w-full max-w-xs object-contain md:max-w-full"
              />
              {product.images.length > 1 && (
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
                  {discount > 0 && (
                    <div className="bg-destructive text-destructive-foreground absolute top-4 left-4 rounded-full px-3 py-1 text-sm font-semibold">
                      -{discount}%
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <Button
                size={'icon'}
                variant={'outline'}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-1 right-1 h-9 w-9 cursor-pointer transition sm:top-3 sm:right-3 ${
                  isWishlisted
                    ? 'bg-destructive/10 hover:bg-destructive/10 text-destructive hover:text-destructive'
                    : 'border-border text-foreground'
                }`}
              >
                <Heart
                  className={`h-7 w-7 ${isWishlisted && 'fill-current'}`}
                />
              </Button>
            </div>
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-24 w-24 scale-95 cursor-pointer overflow-hidden rounded-lg border-2 brightness-90 transition ${
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

          <div className="relative flex flex-col gap-3">
            <div>
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
              <ShowOptions
                key={option.name}
                name={option.name}
                values={option.values}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
              />
            ))}

            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground font-medium">
                {product.stock <= 0 && <b>Out of Stock</b>}
              </span>
            </div>
            {variantDetails.options.length > 0 && (
              <div className="ml-2 flex items-center text-lg">
                <span className="text-destructive tracking-wide">
                  {Object.values(selectedVariant).every((id) => id !== '') &&
                    isVariantAvailable && (
                      <b>Selected variant is not available</b>
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
      </main>
    </div>
  );
}
