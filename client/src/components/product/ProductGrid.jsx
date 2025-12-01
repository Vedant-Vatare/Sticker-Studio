import { Button } from '../ui/button';
import { motion, stagger, animate, delay } from 'motion/react';
import { useAddToCartQuery, useCartQuery } from '@/hooks/cart';

const staggerContainer = {
  hidden: { opacity: 0 },
  animate: {
    delay: stagger(0.1, { ease: 'easeOut' }),
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const ProductGrid = ({ products, showAddToCartBtn }) => {
  const { data: cartItems } = useCartQuery();
  const { mutateAsync: addToCartQuery } = useAddToCartQuery();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <div className="grid w-full grid-cols-2 justify-items-center gap-2 gap-y-7 sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
        {products.map((product, index) => (
          <motion.div
            key={index}
            className="outline-foreground flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-sm p-2"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              delay: Math.min(index * 0.01, 2),
            }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="bg-muted relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md">
              <img
                loading="lazy"
                src={product.image || product.images[0]}
                alt={product.alt || 'Product image'}
                className="h-full w-full object-contain transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="mt-2 w-full text-left">
              <span
                className="font-heading overflow-hidden text-ellipsis"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product.name}
              </span>

              <span className="font-body block text-lg font-semibold">
                {formatPrice(product.price)}
              </span>
            </div>
            {showAddToCartBtn && (
              <>
                {cartItems?.some((item) => item.product.id === product.id) ? (
                  <Button className="mt-1 w-full self-start outline">
                    View in Cart
                  </Button>
                ) : (
                  <Button
                    onClick={() => addToCartQuery(product)}
                    variant={'outline'}
                    className="mt-1 w-full self-start outline"
                  >
                    Add to Cart
                  </Button>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductGrid;
