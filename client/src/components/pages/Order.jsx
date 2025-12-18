import { useNavigate } from 'react-router-dom';
import { useFetchOrders } from '@/hooks/order';
import FormattedDate from '@/utils/FormattedDate';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Package } from 'lucide-react';

const OrderCardSkeleton = () => {
  return (
    <Card className="border-muted min-w-xs rounded-sm border py-4">
      <CardHeader className={'font-heading w-full gap-0.5 px-2 text-sm'}>
        <Skeleton className="mb-2 h-6 w-32" />
        <div className="mb-1 flex justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div className="flex gap-2">
          <Skeleton className="h-20 w-20 rounded-lg sm:h-24 sm:w-24" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
      <CardFooter className={'font-heading gap-2 px-2'}>
        <div className="ml-auto flex flex-col items-end gap-1">
          <Skeleton className="mb-1 h-5 w-24" />
          <Skeleton className="h-10 w-28 rounded-xs" />
        </div>
      </CardFooter>
    </Card>
  );
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const handleViewOrder = () => {
    navigate(`/order/${order.id}`);
  };
  return (
    <Card className="border-muted w-full min-w-xs rounded-sm border-2 px-1 py-4">
      <CardHeader className={'font-heading w-full gap-0.5 px-2 text-sm'}>
        <CardTitle className="text-base capitalize">
          {order.orderStatus}
        </CardTitle>
        <div className="flex justify-between">
          <span className="opacity-60">Order Placed</span>
          <span>
            <FormattedDate date={order.createdAt} />
          </span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-60">Order Id</span>
          <span>{order.id}</span>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div className="flex gap-2">
          <span className="bg-muted relative h-20 w-20 overflow-hidden rounded-lg sm:h-24 sm:w-24">
            <img
              src={order.orderItems[0].product.images[0]}
              alt={order.orderItems[0].product.description}
              className="object-cover"
            />
          </span>
          <div className="font-heading flex flex-col gap-3 font-medium">
            <span>{order.orderItems[0].product.name}</span>
            <span>x{order.orderItems[0].quantity}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter
        className={'font-heading flex flex-row justify-between gap-2 px-2'}
      >
        <div className="self-start">
          {order.orderItems.length > 1 && (
            <span>+{order.orderItems.length} items</span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 self-end">
          <span className="font-medium">Total: ₹{order.totalAmount}</span>
          <Button
            variant={'outline'}
            className={
              'border-primary font-body bg-muted/80 rounded-xs p-4 px-5'
            }
            onClick={handleViewOrder}
          >
            View Order
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const OrderPage = () => {
  const { data: orders, isLoading } = useFetchOrders();
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-2 py-8 md:mt-5">
        <h1 className="text-foreground page-title">Orders</h1>

        <div className="mt-5 flex w-full flex-col gap-5 md:flex-row">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      </div>
    );
  }

  if (orders?.length > 0) {
    return (
      <div className="mx-auto w-full px-2 py-8 sm:w-max md:mt-5">
        <h1 className="text-foreground page-title">Orders</h1>

        <div className="mt-5 grid w-full grid-cols-1 justify-items-center gap-2 gap-y-7 sm:grid-cols-3 sm:gap-6 md:grid-cols-4">
          {orders.map((order) => (
            <OrderCard order={order} key={order.id} />
          ))}
        </div>
      </div>
    );
  }

  if (orders?.length == 0 || (!orders && !isLoading)) {
    return (
      <div className="mx-auto max-w-3xl px-2 py-8 md:mt-5">
        <h1 className="text-foreground page-title">Orders</h1>
        <div className="bg-muted/40 font-heading mx-auto mt-5 flex w-full flex-col items-center gap-3 rounded-sm p-2 py-10 text-center font-semibold">
          <span className="p bg-muted text-muted-foreground grid h-10 w-10 place-items-center rounded-full p-2">
            <Package />
          </span>
          <span className="font-heading">No Orders placed yet</span>
          <div className="mt-7 flex gap-4">
            <Button variant={'outline'} onClick={() => navigate('/cart')}>
              Go to cart
            </Button>
            <Button onClick={() => navigate('/shop')}>Go Shopping</Button>
          </div>
        </div>
      </div>
    );
  }
};

export default OrderPage;
