import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserAddresses } from '@/hooks/user';
import { AddNewAddressModal } from '../user/address/AddAddressDialog';
import ResponsiveModal from '@/components/ui/modal/ResponsiveModal';
import { AddressList } from '@/components/user/address/AddressList';
import { PlusCircleIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AddNewAddress = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <ResponsiveModal
        onOpenChange={setOpenModal}
        open={openModal}
        showCloseButton={true}
        trigger={
          <Button variant={'ghost'} className={'text-primary font-semibold'}>
            <PlusCircleIcon />
            Add
          </Button>
        }
        title="Add new Address"
      >
        <AddNewAddressModal
          open={openModal}
          onOpenChange={setOpenModal}
          closeModal={() => setOpenModal(false)}
        />
      </ResponsiveModal>
    </>
  );
};

const AddressPage = () => {
  const { data: userAddresses, isPending } = useUserAddresses();

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl px-2 py-8 sm:px-6 md:mt-5 lg:px-8">
        <h1 className="text-foreground page-title">Addresses</h1>
        <div className="my-2 mt-7 px-1 py-2 md:my-4">
          <Skeleton className={'my-1 h-10 w-16'} />
          <Skeleton className={'my-2 h-24 w-full'} />
          <Skeleton className={'my-2 h-24 w-full'} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-2 py-8 sm:px-6 md:mt-5 lg:px-8">
      <h1 className="text-foreground page-title">Addresses</h1>
      <div className="my-2 mt-7 px-1 py-2 md:my-4">
        <div className="my-2">
          <AddNewAddress />
        </div>
        <div className="flex flex-col gap-2">
          {userAddresses?.length > 0 ? (
            <AddressList addresses={userAddresses} />
          ) : (
            <>
              <div className="bg-muted font-heading w-full rounded-sm p-2 py-4 text-center font-semibold">
                no saved addresses
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default AddressPage;
