import { Link, Outlet } from 'react-router-dom';
import logo from '@/assets/logo.png';

const AuthHeader = () => {
  return (
    <>
      <header className="absolute top-0 z-999 w-full bg-white p-2 shadow-md md:pl-24">
        <Link to="/">
          <img
            className="h-10 object-contain"
            src={logo}
            alt="Sticker studio"
          />
        </Link>
      </header>
      <Outlet />
    </>
  );
};

export default AuthHeader;
