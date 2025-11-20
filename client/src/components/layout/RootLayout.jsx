import { Outlet } from 'react-router-dom';
import MobileNavigationLayout from './MobileNavigation';
import RootHeaderLayout from './RootHeader';
import TopBanner from './TopBanner';
import Footer from '../Footer';
import ScrollManager from '@/utils/ScrollManager';
import { SidebarProvider } from '../ui/sidebar';
import { AccountSidebar } from './AccountSidebar';

const RootLayout = () => {
  return (
    <>
      <TopBanner />
      <RootHeaderLayout />
      <ScrollManager />
      <main className="min-h-screen pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <SidebarProvider defaultOpen={false} className={'z-999'}>
        <MobileNavigationLayout />
        <AccountSidebar />
      </SidebarProvider>
    </>
  );
};

export default RootLayout;
