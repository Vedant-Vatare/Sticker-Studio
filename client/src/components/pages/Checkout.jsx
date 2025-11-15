import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { ShoppingBag, Percent, PackageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCartQuery } from '@/hooks/cart';
import ServerError from './ServerError';
import { breadcrumbStore } from '@/store/globalStore';
import { useUserStore } from '@/store/userStore';
import { useLoginModal } from '@/store/userStore';
import { usePlaceOrder } from '@/hooks/order';
import { useRazorpay } from 'react-razorpay';
import { verifyPayment } from '@/services/order';
import { ShippingAddressSection } from '../user/ShippingAddress';

const Checkout = () => {
  const { data: cartItems, isLoading, isError } = useCartQuery();
  const { mutateAsync: placeOrder, isPending: isPlacingOrder } =
    usePlaceOrder();
  const { Razorpay } = useRazorpay();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [shippingAddressId, setShippingAddressId] = useState(false);
  const setBreadcrumbs = breadcrumbStore((state) => state.setBreadcrumbs);
  const openLoginModal = useLoginModal((state) => state.openModal);
  const subtotal =
    cartItems?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ) || 0;
  const discount = subtotal > 999 ? 100 : 0;
  const shipping = 20;
  const total = subtotal - discount + shipping;

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: '/' },
      { label: 'Cart', path: '/cart' },
      { label: 'Checkout', path: '/checkout' },
    ]);
  }, [setBreadcrumbs]);

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    if (!agreedToTerms) return;
    const orderItems = cartItems?.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    const order = await placeOrder({ orderItems, shippingAddressId });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      name: 'Sticker Studio',
      description: 'Test Transaction',
      order_id: order.razorpay.orderId,
      amount: order.razorpay.amount,
      currency: order.razorpay.currency,
      handler: async (razorpayResponse) => {
        const razorpayVerification = await verifyPayment(razorpayResponse);
      },
      prefill: {
        name: 'test user',
        email: 'test.user@example.com',
        contact: '+911231231231',
      },
      theme: {
        color: '#2563eb',
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  if (isError) {
    return <ServerError />;
  }

  if (cartItems?.length === 0) {
    return (
      <div className="bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-8 sm:px-6 lg:px-8">
          <Card className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="text-muted-foreground mb-4 h-16 w-16" />
            <p className="text-muted-foreground mb-4 text-lg">
              Your cart is empty
            </p>
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-8">
      <div className="mx-auto max-w-3xl px-2 py-8 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h1 className="text-foreground page-title">Checkout</h1>
        </div>

        {!isLoggedIn && (
          <div className="border-border bg-info/60 mb-6 border p-4">
            <p className="text-foreground font-body text-center font-bold">
              Please{' '}
              <Button
                variant={'ghost'}
                className={
                  'text-primary bg-transparent p-2 text-base font-semibold hover:bg-transparent hover:underline'
                }
              >
                Login
              </Button>{' '}
              to proceed with checkout
            </p>
          </div>
        )}
        <ShippingAddressSection
          shippingAddressId={shippingAddressId}
          setShippingAddressId={setShippingAddressId}
        />
        <Card className="border-border bg-muted/30 gap-3 rounded-xs border p-4 md:p-6">
          <h2 className="text-foreground font-medium!">Order Summary</h2>

          <div className="space-y-4">
            {cartItems?.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="shrink-0">
                    <div className="bg-muted relative h-20 w-20 overflow-hidden rounded-lg sm:h-32 sm:w-32">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 self-start">
                    <h3 className="text-foreground text-base font-medium">
                      {item.product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground text-lg font-semibold">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
                {index < cartItems.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                Subtotal ({cartItems?.length} items)
              </span>
              <span className="text-foreground font-bold">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <Percent className="h-3 w-3" />
                  Discount
                </span>
                <span className="font-medium text-green-500">
                  - ₹{discount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold">
                <PackageIcon className="h-3 w-3" />
                Shipping
              </span>
              <span className="font-medium">₹{shipping.toLocaleString()}</span>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="text-foreground text-lg font-semibold">
                Total
              </span>
              <span className="text-foreground text-xl font-bold">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-muted-foreground cursor-pointer text-sm leading-relaxed"
            >
              I have read and agree to the{' '}
              <Link
                to="/privacy-policy"
                className="text-foreground underline hover:opacity-80"
              >
                Privacy Policy
              </Link>
              ,{' '}
              <Link
                to="/terms-of-sale"
                className="text-foreground underline hover:opacity-80"
              >
                Terms of Sale
              </Link>
              , and{' '}
              <Link
                to="/terms-of-service"
                className="text-foreground underline hover:opacity-80"
              >
                Terms of Service
              </Link>
            </label>
          </div>
          <Button
            className="mt-3 w-full text-base"
            size="lg"
            disabled={!agreedToTerms || isPlacingOrder}
            onClick={handlePlaceOrder}
          >
            {isPlacingOrder ? 'Processing...' : 'Place Order'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

const CheckoutSkeleton = () => {
  return (
    <div className="bg-background min-h-screen pb-8">
      <div className="mx-auto max-w-3xl px-2 py-8 sm:px-6 lg:px-8">
        <h1 className="text-foreground page-title mb-5">Checkout</h1>
        <Card className="border-border border p-6">
          <Skeleton className="mb-6 h-7 w-40" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                {i < 2 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-4 h-6 w-full" />
          </div>
          <Separator className="my-6" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="mt-6 h-12 w-full" />
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
