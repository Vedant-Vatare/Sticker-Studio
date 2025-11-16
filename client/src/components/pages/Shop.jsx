import { breadcrumbStore } from '@/store/globalStore';
import { ShopCategoryImages } from '@/utils/images';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const Shop = () => {
  const setBreadcrumbs = breadcrumbStore((store) => store.setBreadcrumbs);

  useEffect(() => {
    setBreadcrumbs([
      { label: 'home', path: '/' },
      { label: 'shop', path: '/shop' },
    ]);

    return () => setBreadcrumbs([]);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 md:py-8 lg:px-8">
      <motion.div className="mb-2 md:mb-8">
        <h1 className="page-title text-3xl! font-bold">Shop By Collection</h1>
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {ShopCategoryImages.map((category, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Link
              to={`/shop/${category.slug}`}
              className="outline-foreground group block rounded-md p-2 transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-4/5 max-h-80 w-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full max-h-80 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              </div>
              <h2 className="group-hover:text-primary my-3 text-lg font-medium transition-colors">
                {category.title}
              </h2>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Shop;
