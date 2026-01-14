import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus } from 'lucide-react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useAddToCartMutation, useCartQuery } from '@/hooks/cart';
import { checkoutOrderStore } from '@/store/globalStore';

const BuyNowModal = ({ closeModal, orderItem }) => {
  const navigate = useNavigate();
  console.log(orderItem);
  const [buyingQuantity, setBuyingQuantity] = useState(1);
  const price = orderItem.variant?.price ?? orderItem.product.price;
  const availableStock = orderItem.variant?.stock ?? orderItem.product.stock;
  const itemSubTotal = price;
  const setCheckoutItems = checkoutOrderStore((store) => store.setOrderItem);
  const { data: { cartItems } = {}, isLoading, isSuccess } = useCartQuery();
  const { mutate: addToCart, isPending } = useAddToCartMutation();

  if (isLoading || !isSuccess) return null;

  const isAddedInCart = cartItems?.some(
    (item) =>
      item.product.id === orderItem.product.id &&
      item?.variant?.id === orderItem.variant?.id,
  );

  const handleViewCart = () => {
    closeModal();
    if (!isAddedInCart) {
      addToCart({
        product: orderItem.product,
        variant: orderItem.variant,
        quantity: buyingQuantity,
      });
    }
    navigate('/cart');
  };

  const handleCheckout = () => {
    closeModal();
    setCheckoutItems([
      {
        product: orderItem.product,
        variant: orderItem.variant,
        quantity: buyingQuantity,
      },
    ]);
    navigate('/checkout');
  };

  return (
    <>
      <div className="flex items-start gap-4 p-1 pb-4 md:p-4">
        <div className="shrink-0">
          <div className="bg-muted relative h-24 w-24 overflow-hidden rounded-lg sm:h-32 sm:w-32">
            <img
              src={
                orderItem.variant?.images?.[0] || orderItem.product.images[0]
              }
              alt={orderItem.product.name}
              className="h-full w-full object-contain p-2"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div>
            <h3 className="text-foreground text-base leading-tight font-semibold sm:text-lg">
              {orderItem.product.name}
            </h3>
            {orderItem.variant && (
              <p className="text-muted-foreground mt-1 text-sm">
                {orderItem.variant.name}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={buyingQuantity <= 1}
                onClick={(e) => {
                  e.stopPropagation();
                  setBuyingQuantity(buyingQuantity - 1);
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-10 text-center text-base font-semibold">
                {buyingQuantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  setBuyingQuantity(buyingQuantity + 1);
                }}
                disabled={buyingQuantity >= availableStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-foreground text-xl font-bold">
                ₹{itemSubTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator className={'my-2'} />

      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2 sm:w-auto"
          onClick={handleViewCart}
        >
          <ShoppingCart className="h-5 w-5" />
          View in Cart
        </Button>
        <Button
          size="lg"
          className="bg-accent-foreground hover:bg-accent-foreground/90 w-full gap-2 sm:w-auto"
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </div>
    </>
  );
};

export default BuyNowModal;
