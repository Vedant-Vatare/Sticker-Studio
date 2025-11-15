import logoIcon from '@/assets/logo-icon.png';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PageNotFound = () => {
  return (
    <div className="flex min-h-dvh w-screen flex-col items-center justify-center">
      <div className="flex items-center">
        <img
          src={logoIcon}
          alt="sticker studio"
          className="bg-muted h-14 rounded-full p-0.5"
        />
        <h3 className="font-heading text-2xl font-bold">404 Not Found</h3>
      </div>
      <p className="font-body">Please check the URL again</p>
      <Button className={'mt-6'}>
        <Link to="/">Go back to Home </Link>
      </Button>
    </div>
  );
};

export default PageNotFound;
