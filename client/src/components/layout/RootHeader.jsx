import { Search, ShoppingBagIcon, User2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { BorderTrail } from '../ui/border-trail';
import { Button, buttonVariants } from '../ui/button';
import { useCartQuery } from '@/hooks/cart';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@/hooks/useMediaQuery';

const RootHeaderLayout = () => {
  const navigate = useNavigate();
  const { data: cartItems } = useCartQuery();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const handleAccountClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/account');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <header className="sticky top-0 z-999 bg-white shadow-md">
      <div className="flex h-14 w-full items-center justify-between px-3 md:gap-2">
        <div className="flex h-full items-center">
          <div className="grid w-32 place-items-center md:w-48">
            <Link to="/">
              <img
                className="h-10 object-contain"
                src={logo}
                alt="Sticker studio"
              />
            </Link>
          </div>
        </div>

        <nav className="font-heading hidden w-max items-center gap-4 md:flex md:gap-10">
          <Link
            className="hover:bg-muted w-max rounded-md p-2 px-3 transition-colors duration-200"
            to="/"
          >
            Home
          </Link>
          <Link
            className="hover:bg-muted w-max rounded-md p-2 px-3 transition-colors duration-200"
            to="/shop"
          >
            Shop
          </Link>
          <Link
            className="hover:bg-muted duration200300 w-max rounded-md p-2 px-3 transition-colors"
            to="/contact"
          >
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <div className="relative min-w-10 lg:w-80">
              <InputSearchbar />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/wishlist"
              className={`${buttonVariants({
                variant: 'outline',
                size: 'icon',
              })} bg-primary-foreground relative inline-flex aspect-square h-10 w-10 items-center justify-center p-0`}
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              to="/cart"
              className={`${buttonVariants({
                variant: 'outline',
                size: 'icon',
              })} bg-primary-foreground relative inline-flex aspect-square h-10 w-10 items-center justify-center p-0`}
            >
              {!isNaN(cartItems?.length) && cartItems.length > 0 && (
                <span className="bg-primary absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full font-sans text-xs font-semibold text-white">
                  {cartItems.length}
                </span>
              )}
              <ShoppingBagIcon className="h-5 w-5" />
            </Link>
            {!!isDesktop && (
              <button
                onClick={handleAccountClick}
                className={`${buttonVariants({
                  variant: 'outline',
                  size: 'icon',
                })} bg-primary-foreground relative inline-flex aspect-square h-10 w-10 cursor-pointer items-center justify-center p-0`}
              >
                <User2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* small screen search bar */}
      <div className="flex w-full items-center gap-3 px-3 pb-2 md:hidden">
        <div className="relative flex w-full items-center">
          <InputSearchbar />
        </div>
      </div>
    </header>
  );
};

const InputSearchbar = () => {
  return (
    <div className="relative flex h-full w-full items-center overflow-hidden rounded-sm">
      <input
        type="text"
        name="search"
        placeholder="Search..."
        className="focus:ring-accent text-md h-max w-full rounded-sm border border-gray-300 p-2 px-4 pr-10 font-sans focus:ring-2 focus:outline-none"
      />
      <Button
        variant={'outline'}
        className="bg-muted absolute right-2 my-1 flex h-8 w-8 items-center justify-center rounded-full p-0"
      >
        <Search className="h-4 w-4 cursor-pointer" />
      </Button>
      <BorderTrail
        className="bg-linear-to-l from-blue-200 via-blue-500 to-blue-200"
        size={120}
      />
    </div>
  );
};

export default RootHeaderLayout;
