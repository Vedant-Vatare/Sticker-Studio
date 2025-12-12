import { useProductDimensions, useProductSpecs } from '@/hooks/product';
import { memo } from 'react';
import { Skeleton } from '../ui/skeleton';

const ProductInfo = memo(({ productId, variantId }) => {
  return (
    <div className="section-title bg-section-background my-6 rounded-sm p-4">
      <ProductSpecifications productId={productId} variantId={variantId} />
      <ProductDimensions productId={productId} variantId={variantId} />
    </div>
  );
});

const LoadingItem = () => {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className={'bg-foreground/5 h-5 w-16'} />
      <Skeleton className={'bg-foreground/5 h-5 w-36'} />
    </div>
  );
};

const ListItem = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-lg font-medium">{label}</span>
      <span className="text-base opacity-85">{value}</span>
    </div>
  );
};

const ProductSpecifications = ({ productId, variantId }) => {
  const { data: specifications, isLoading } = useProductSpecs(productId);

  if (isLoading) {
    return (
      <div>
        <h3>Product Highlights</h3>
        <div className="mt-7 grid grid-cols-2 gap-6 px-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingItem key={i} />
          ))}
        </div>
      </div>
    );
  }

  const variantSpec = specifications?.find(
    (spec) => spec.variantId === variantId,
  );

  const baseSpec = specifications?.find((spec) => spec.variantId === null);

  const finalSpec = variantSpec?.data || baseSpec?.data || {};

  if (Object.keys(finalSpec).length > 0) {
    return (
      <div>
        <h3>Product Highlights</h3>
        <div className="mt-7 grid grid-cols-2 gap-6 px-2">
          {Object.entries(finalSpec).map(([label, value]) => (
            <ListItem label={label} value={value} key={label} />
          ))}
        </div>
      </div>
    );
  }
};

const ProductDimensions = ({ productId, variantId }) => {
  const { data: dimensions, isLoading } = useProductDimensions(productId);

  if (isLoading) {
    return (
      <div className="mt-12">
        <h3>Product Dimensions</h3>
        <div className="mt-7 grid grid-cols-2 gap-6 px-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingItem key={i} />
          ))}
        </div>
      </div>
    );
  }

  const variantDimensions = dimensions?.find((d) => d.variantId === variantId);
  const baseDimensions = dimensions?.find((d) => d.variantId === null);

  const finalDimensions = variantDimensions || baseDimensions || {};

  const dimensionKeys = ['length', 'width', 'height', 'weight', 'thickness'];

  const dimensionsToShow = dimensionKeys.reduce((acc, key) => {
    if (finalDimensions[key] != null && finalDimensions[key] > 0) {
      acc[key] = `${finalDimensions[key]}${finalDimensions.unit || ''}`;
    }
    return acc;
  }, {});

  if (Object.keys(dimensionsToShow).length > 0) {
    return (
      <div className="mt-12">
        <h3>Product Dimensions</h3>

        <div className="mt-7 grid grid-cols-2 gap-6 px-2">
          {Object.entries(dimensionsToShow).map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-lg font-medium capitalize">{label}</span>
              <span className="text-base opacity-85">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ProductInfo;
