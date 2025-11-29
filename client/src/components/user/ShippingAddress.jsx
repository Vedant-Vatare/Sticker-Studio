import { useEffect, useState } from 'react';

import { useAddUserAddress, useUserAddresses } from '@/hooks/user';
import { MapPin, PlusCircleIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ResponsiveModal from '@/components/ui/modal/ResponsiveModal';
import { AddressModal } from './address/AddressModal';
import { AddressCard } from './address/AddressCard';

const ChangeShippingAddress = ({
  addresses,
  shippingAddressId,
  setShippingAddressId,
  closeModal,
}) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-1 px-1 sm:gap-3">
      {addresses.map((addr) => (
        <div className="relative" key={addr.id}>
          <AddressCard
            address={addr}
            className="cursor-pointer py-1 sm:py-2"
            onClick={() => {
              setShippingAddressId(addr.id);
              closeModal();
            }}
          />
          {shippingAddressId === addr.id && (
            <Badge variant="info" className="absolute top-2 right-2">
              Selected
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
};

export const ShippingAddressSection = ({
  shippingAddressId,
  setShippingAddressId,
}) => {
  const { data: addresses = [], isLoading } = useUserAddresses();
  const [openNewAddressModal, setOpenNewAddressModal] = useState(false);
  const [openChangeAddressModal, setOpenChangeAddressModal] = useState(false);
  const { mutate: addNewAddress, isPending, isSuccess } = useAddUserAddress();
  useEffect(() => {
    if (addresses.length) {
      setShippingAddressId(
        addresses.find((a) => a.isDefault)?.id || addresses[0]?.id,
      );
    }
  }, [addresses]);

  const SelectedShippingAddress = addresses.find(
    (a) => a.id === shippingAddressId,
  );

  if (isLoading)
    return (
      <Card className="border-border mb-3 rounded-lg border p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-36" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
      </Card>
    );

  return (
    <Card className="my-2 gap-2 rounded-none py-3">
      <CardContent className="px-2 md:p-3">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title text-base!">Shipping Address</h2>

          {addresses.length > 1 && (
            <ResponsiveModal
              onOpenChange={setOpenChangeAddressModal}
              open={openChangeAddressModal}
              showCloseButton={true}
              trigger={
                <Button
                  disabled={addresses?.length < 1}
                  variant={'outline'}
                  size={'sm'}
                  className={'font-medium'}
                >
                  <span>Change</span>
                </Button>
              }
              title="Your Addresses"
            >
              <ChangeShippingAddress
                addresses={addresses}
                shippingAddressId={shippingAddressId}
                setShippingAddressId={setShippingAddressId}
                closeModal={() => setOpenChangeAddressModal(false)}
              />
            </ResponsiveModal>
          )}
        </div>

        {SelectedShippingAddress && (
          <AddressCard
            className="border-none bg-inherit p-2!"
            address={SelectedShippingAddress}
          />
        )}
      </CardContent>
      {addresses.length < 3 && (
        <ResponsiveModal
          onOpenChange={setOpenNewAddressModal}
          open={openNewAddressModal}
          showCloseButton={true}
          trigger={
            <Button
              disabled={addresses?.length >= 3}
              variant={'ghost'}
              size={'sm'}
              className={'text-primary mx-3 mt-3 font-semibold'}
            >
              <>
                <PlusCircleIcon className="h-7 w-7" />
                <span>Add new address</span>
              </>
            </Button>
          }
          title="Add new Address"
        >
          <AddressModal
            open={openNewAddressModal}
            onOpenChange={setOpenNewAddressModal}
            closeModal={() => setOpenNewAddressModal(false)}
            onSubmit={addNewAddress}
            isPending={isPending}
            isSuccess={isSuccess}
          />
        </ResponsiveModal>
      )}
    </Card>
  );
};
