import {
  useIsProductInWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/hooks/wishlist';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const WishlistButton = ({ product }) => {
  const productWishlist = useIsProductInWishlist(product?.id);
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  if (productWishlist.isPending) {
    return null;
  }

  return (
    <Button
      size={'icon'}
      variant={'outline'}
      onClick={() =>
        productWishlist.inWishlist
          ? removeFromWishlist(product.id)
          : addToWishlist(product.id)
      }
      className={`absolute top-1 right-1 h-9 w-9 cursor-pointer border-none transition outline-none focus:border-none sm:top-3 sm:right-3 ${
        productWishlist.inWishlist
          ? 'hover:text-destructive bg-[#F73B9C]/10 text-[#F73B9C] hover:bg-[#F73B9C]/10'
          : 'border-border text-foreground'
      }`}
    >
      <Heart
        className={`h-7 w-7 ${productWishlist.inWishlist && 'fill-current'}`}
      />
    </Button>
  );
};

export default WishlistButton;
