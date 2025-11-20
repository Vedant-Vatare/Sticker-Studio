import { useLocation } from 'react-router-dom';
const ACCOUNT_PAGES = [
  '/account',
  '/profile',
  '/orders',
  '/wishlist',
  '/address',
  '/settings',
];
const useCurrentPage = () => {
  const path = useLocation().pathname;
  let currentMainPage = '';

  if (path === '/') currentMainPage = 'home';
  if (path === '/shop' || path.startsWith('/shop/')) currentMainPage = 'shop';
  if (ACCOUNT_PAGES.includes(path)) currentMainPage = 'account';
  return currentMainPage;
};

export default useCurrentPage;
