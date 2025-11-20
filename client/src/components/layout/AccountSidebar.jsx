import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, User2, Package, MapPinIcon, Settings, Heart } from 'lucide-react';

export function AccountSidebar() {
  const { toggleSidebar } = useSidebar();
  const currentPage = useLocation().pathname;

  return (
    <Sidebar className="w-60 rounded-tl-xs rounded-bl-xs p-2" side="right">
      <SidebarHeader
        className={'mt-2 flex flex-row items-center justify-between pr-4'}
      >
        <h3 className="font-heading">Account</h3>
        <Button size={'icon'} variant={'ghost'} onClick={toggleSidebar}>
          <X className="flex-1" />
        </Button>
      </SidebarHeader>
      <SidebarContent className={'mt-2'}>
        <SidebarGroup className={'flex flex-col gap-3'}>
          <Link
            to={'/profile'}
            onClick={toggleSidebar}
            className={`bg-muted rounded-md p-2 text-base ${currentPage === '/profile' && 'text-primary font-semibold'}`}
          >
            <div className="flex items-center gap-3">
              <Button variant={'outline'} size={'icon'}>
                <User2 />
              </Button>
              <span>Profile</span>
            </div>
          </Link>
          <Link
            to={'/orders'}
            onClick={toggleSidebar}
            className={`bg-muted rounded-md p-2 text-base ${currentPage === '/orders' && 'text-primary font-semibold'}`}
          >
            <div className="flex items-center gap-3">
              <Button variant={'outline'} size={'icon'}>
                <Package />
              </Button>
              <span>Orders</span>
            </div>
          </Link>
          <Link
            to={'/wishlist'}
            onClick={toggleSidebar}
            className={`bg-muted rounded-md p-2 text-base ${currentPage === '/wishlist' && 'text-primary font-semibold'}`}
          >
            <div className="flex items-center gap-3">
              <Button variant={'outline'} size={'icon'}>
                <Heart />
              </Button>
              <span>Wishlist</span>
            </div>
          </Link>
          <Link
            to={'/addresses'}
            onClick={toggleSidebar}
            className={`bg-muted rounded-md p-2 text-base ${currentPage === '/addresses' && 'text-primary font-semibold'}`}
          >
            <div className="flex items-center gap-3">
              <Button variant={'outline'} size={'icon'}>
                <MapPinIcon />
              </Button>
              <span>Addresses</span>
            </div>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <Link
          to={'/settings'}
          onClick={toggleSidebar}
          className={`bg-muted rounded-md p-2 text-base ${currentPage === '/settings' && 'text-primary font-semibold'}`}
        >
          <div className="bg-muted flex items-center gap-3">
            <Button variant={'outline'} size={'icon'}>
              <Settings />
            </Button>
            <span>Settings</span>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
