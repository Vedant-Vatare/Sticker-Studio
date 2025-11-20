import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ShoppingBag, User2 } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useSidebar } from '../ui/sidebar';
import useCurrentPage from '@/hooks/useCurrentPage';

const MobileNavigationLayout = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const isLoggedIn = useUserStore((store) => store.isLoggedIn);
  const currentPage = useCurrentPage();

  function handleAccountClick() {
    if (!isLoggedIn) {
      navigate('/auth/signup');
      return;
    }
    toggleSidebar();
  }

  return (
    <div className="font-heading fixed right-0 bottom-0 left-0 z-999 flex justify-around border-t border-gray-200 bg-white p-2 text-xs font-semibold tracking-wide md:hidden">
      <Link to="/" className="flex cursor-pointer flex-col items-center">
        <span
          className={`rounded-full p-3 transition-colors ${currentPage === 'home' ? 'bg-primary text-white' : 'bg-primary-foreground'}`}
        >
          <HomeIcon className="h-5 w-5" />
        </span>
        <span className={`${currentPage === 'home' ? 'text-primary' : ''}`}>
          Home
        </span>
      </Link>
      <Link to="/shop" className="flex cursor-pointer flex-col items-center">
        <span
          className={`rounded-full p-3 transition-colors ${currentPage === 'shop' ? 'bg-primary text-white' : 'bg-primary-foreground'}`}
        >
          <ShoppingBag className="h-5 w-5" />
        </span>
        <span className={`${currentPage === 'shop' ? 'text-primary' : ''}`}>
          Shop
        </span>
      </Link>
      <button
        onClick={handleAccountClick}
        className="flex cursor-pointer flex-col items-center"
      >
        <span
          className={`rounded-full p-3 transition-colors ${currentPage === 'account' ? 'bg-primary text-white' : 'bg-primary-foreground'}`}
        >
          <User2 className="h-5 w-5" />
        </span>
        <span className={`${currentPage === 'account' ? 'text-primary' : ''}`}>
          Account
        </span>
      </button>
    </div>
  );
};

export default MobileNavigationLayout;
