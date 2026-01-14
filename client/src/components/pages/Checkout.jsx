import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { ShoppingBag, Percent, PackageIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { breadcrumbStore, checkoutOrderStore } from '@/store/globalStore';
import { useUserStore } from '@/store/userStore';
import { useLoginModal } from '@/store/userStore';
import { usePlaceOrder } from '@/hooks/order';
import { useRazorpay } from 'react-razorpay';
import { cancelOrder, verifyPayment } from '@/services/order';
import { ShippingAddressSection } from '../user/ShippingAddress';
import { toast } from 'sonner';

const Checkout = () => {
  const orderItems = checkoutOrderStore((store) => store.orderItems);
  const user = useUserStore((state) => state.user);
  const { mutateAsync: placeOrder, isPending: isPlacingOrder } =
    usePlaceOrder();
  const { Razorpay } = useRazorpay();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [shippingAddressId, setShippingAddressId] = useState(null);
  const setBreadcrumbs = breadcrumbStore((state) => state.setBreadcrumbs);
  const openLoginModal = useLoginModal((state) => state.openModal);

  const isCancellingRef = useRef(false);

  const subtotal =
    orderItems?.reduce((total, item) => {
      const price = item.variant?.price ?? item.product.price;
      return total + price * item.quantity;
    }, 0) || 0;

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

  const handleCancelOrder = async (orderId) => {
    if (isCancellingRef.current) {
      return;
    }

    isCancellingRef.current = true;
    try {
      await cancelOrder(orderId);
      toast.info('Your order was cancelled');
    } catch (e) {
      console.error('Failed to cancel order:', e);
      toast.error('Failed to cancel the order');
    } finally {
      isCancellingRef.current = false;
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!shippingAddressId) {
      toast.error('Please select a shipping address');
      return;
    }

    const order = orderItems?.map((item) => ({
      productId: item.product.id,
      variantId: item?.variant?.id || null,
      quantity: item.quantity,
    }));

    let placedOrder;

    try {
      placedOrder = await placeOrder({
        orderItems: order,
        shippingAddressId,
      });
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error(
        error?.response?.data?.message ||
          'Failed to create order. Please try again.',
      );
      return;
    }

    isCancellingRef.current = false;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      name: 'Sticker Studio',
      description: 'Order Payment',
      order_id: placedOrder.razorpay.orderId,
      amount: placedOrder.razorpay.amount,
      currency: placedOrder.razorpay.currency,
      handler: async (razorpayResponse) => {
        try {
          await verifyPayment(razorpayResponse);
          toast.success('Your order has been confirmed.');
        } catch (e) {
          console.error('Payment verification failed:', e);
          toast.error('Failed to verify payment. Please contact support.');
        }
      },
      prefill: {
        name: user?.full_name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#2563eb',
      },
      modal: {
        ondismiss: async () => {
          await handleCancelOrder(placedOrder.order.id);
        },
      },
    };

    const razorpayInstance = new Razorpay(options);

    razorpayInstance.on('payment.failed', async (response) => {
      console.error('Payment failed:', response.error);
      toast.error(`Payment failed: ${response.error.description}`);
      await handleCancelOrder(placedOrder.order.id);
    });

    razorpayInstance.open();
  };

  if (orderItems?.length === 0) {
    return (
      <div className="bg-muted min-h-screen">
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
    <div className="bg-muted min-h-screen pb-8">
      <div className="mx-auto max-w-4xl px-2 py-8 sm:px-6 lg:px-8">
        <h2 className="section-title">Checkout</h2>

        {!isLoggedIn && (
          <div className="border-border bg-info/60 mb-6 border p-4">
            <p className="text-foreground font-body text-center font-bold">
              Please
              <Link
                to={'/auth/login'}
                variant={'ghost'}
                className={
                  'text-primary bg-transparent p-1 text-base font-semibold hover:bg-transparent hover:underline'
                }
              >
                log in
              </Link>
              to your account to proceed with checkout
            </p>
          </div>
        )}

        <ShippingAddressSection
          shippingAddressId={shippingAddressId}
          setShippingAddressId={setShippingAddressId}
        />

        <Card className="border-border gap-3 rounded-xs border p-4 md:p-6">
          <h2 className="section-title text-base!">Order Summary</h2>

          <div className="space-y-4">
            {orderItems?.map((item, index) => {
              const price = item.variant?.price ?? item.product.price;
              const itemTotal = price * item.quantity;

              return (
                <div key={item.id || index}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="shrink-0">
                      <div className="bg-muted relative h-20 w-20 overflow-hidden rounded-lg sm:h-32 sm:w-32">
                        <img
                          src={
                            item?.variant?.images[0] || item.product.images[0]
                          }
                          alt={item.product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex-1 self-start">
                      <h3 className="text-foreground text-base font-medium">
                        {item.product.name}
                      </h3>
                      {item.variant && (
                        <p className="text-muted-foreground text-sm">
                          Variant: {item.variant.sku}
                        </p>
                      )}
                      <p className="text-muted-foreground text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground text-lg font-semibold">
                        ₹{itemTotal.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        ₹{price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                  {index < orderItems.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })}
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                Subtotal ({orderItems?.length} items)
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
            disabled={!agreedToTerms || !shippingAddressId || isPlacingOrder}
            onClick={handlePlaceOrder}
          >
            {isPlacingOrder ? 'Processing...' : 'Place Order'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
