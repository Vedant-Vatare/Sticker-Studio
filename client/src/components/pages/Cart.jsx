import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import { useEffect } from 'react';
import {
  useCartQuery,
  useDeleteCartItemQuery,
  useUpdateCartItemQuery,
} from '@/hooks/cart';
import ServerError from './ServerError';
import { breadcrumbStore } from '@/store/globalStore';

import CartFAQ from '../ui/FAQ/CartFAQ';

const Cart = () => {
  const {
    data: { cartItems } = {},
    isLoading,
    isSuccess,
    isError,
  } = useCartQuery();

  const setBreadcrumbs = breadcrumbStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: '/' },
      { label: 'Cart', path: '/cart' },
    ]);

    return () => setBreadcrumbs([]);
  }, []);

  if ((isLoading, !isSuccess)) {
    return <CartSkeleton />;
  }

  if (isError) {
    return <ServerError />;
  }

  const cartValue = cartItems?.reduce((total, item) => {
    const price = item?.variant ? item.variant.price : item.product.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <>
      <div
        initial="hidden"
        animate="visible"
        className="bg-background relative min-h-screen md:pb-0"
      >
        <div className="mx-auto max-w-7xl px-2 py-8 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h1 className="text-foreground page-title">
              Shopping Cart
              {cartItems?.length > 0 && (
                <p className="ml-1 inline opacity-80">({cartItems.length})</p>
              )}
            </h1>
          </div>

          {cartItems?.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground text-lg">
                Your cart is empty
              </p>
              <Link to="/">
                <Button>Continue Shopping</Button>
              </Link>
            </Card>
          ) : (
            <>
              <div className="flex w-full justify-center">
                <div className="flex w-full max-w-3xl flex-col gap-2">
                  {cartItems?.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
              <CartFAQ />
            </>
          )}
        </div>
      </div>
      {cartItems?.length > 0 && (
        <div className="bg-background fixed right-0 bottom-18 left-0 z-50 flex w-screen items-center justify-between gap-10 border border-t-2 pl-3 backdrop-blur-sm md:bottom-0 md:justify-end md:px-10">
          <span className="text-base font-semibold md:text-xl">
            ₹{cartValue.toLocaleString()}
          </span>
          <Link to="/checkout" className="block w-max">
            <Button
              className="h-12 rounded-none px-10 text-base md:px-16"
              size="lg"
            >
              Checkout
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

const CartItem = ({ item }) => {
  const naviagate = useNavigate();
  const { data: { options } = {} } = useCartQuery();
  const { product, variant, quantity, id } = item;
  const { mutateAsync: updateCartItem } = useUpdateCartItemQuery();
  const { mutateAsync: removeCartItem } = useDeleteCartItemQuery();

  const displayImage = variant?.images?.[0] || product.images[0];
  const displayPrice = variant?.price || product.price;
  const displayStock = variant?.stock
    ? variant?.stock - variant?.reservedStock
    : product.stock - product.reservedStock;
  const displayName = variant?.name || product.name;
  const selectedvariant = options
    ?.filter((o) => variant?.variant.includes(o.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card className="border-border bg-muted/40 w-full overflow-hidden border py-4">
      <div
        onClick={(e) => {
          e.preventDefault();
          naviagate(`/product/${product.slug || product.id}`);
        }}
        className="flex gap-2 px-2 py-2 sm:flex-row sm:gap-6 md:p-4 md:py-2"
      >
        <div className="shrink-0">
          <div className="bg-muted relative h-24 w-24 overflow-hidden rounded-lg sm:h-32 sm:w-32">
            <img
              src={displayImage}
              alt={displayName}
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="text-foreground font-semibold">{displayName}</h3>
            <div className="flex gap-2 divide-x-2">
              {selectedvariant?.length > 0 &&
                selectedvariant.map((v) => (
                  <p key={v.id} className="mt-1 px-2">
                    {v.value}
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={quantity <= 1}
              onClick={(e) => {
                e.stopPropagation();
                updateCartItem({
                  cartItemId: id,
                  updatedQuantity: quantity - 1,
                });
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                updateCartItem({
                  cartItemId: id,
                  updatedQuantity: quantity + 1,
                });
              }}
              disabled={quantity >= displayStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <p className="text-foreground text-lg font-semibold tracking-tight">
              ₹{displayPrice.toLocaleString()}
            </p>
            <p className="text-muted-foreground mt-1 font-medium tracking-tight line-through">
              ₹{Number(displayPrice + 100).toLocaleString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-75 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              removeCartItem(item.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CartSkeleton = () => {
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

export default Cart;
