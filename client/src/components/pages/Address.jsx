import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { useAddUserAddress, useUserAddresses } from '@/hooks/user';
import { AddressModal } from '../user/address/AddressModal';
import ResponsiveModal from '@/components/ui/modal/ResponsiveModal';
import { PlusCircleIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AddressCard } from '../user/address/AddressCard';

const AddNewAddress = () => {
  const [openModal, setOpenModal] = useState(false);
  const { mutate: addNewAddress, isPending, isSuccess } = useAddUserAddress();
  const { data: userAddresses } = useUserAddresses();

  return (
    <>
      <ResponsiveModal
        onOpenChange={setOpenModal}
        open={openModal}
        showCloseButton={true}
        trigger={
          <Button
            disabled={userAddresses?.length >= 3}
            variant={'ghost'}
            className={
              'text-primary w-full text-base font-semibold outline-2 -outline-offset-1 outline-dashed'
            }
          >
            {userAddresses?.length >= 3 ? (
              <span className="text-muted-foreground text-center text-sm">
                You can save up to 3 addresses.
              </span>
            ) : (
              <>
                <PlusCircleIcon className="h-7 w-7" />
                <span>Add new address</span>
              </>
            )}
          </Button>
        }
        title="Add new Address"
      >
        <AddressModal
          open={openModal}
          onSubmit={addNewAddress}
          onOpenChange={setOpenModal}
          closeModal={() => setOpenModal(false)}
          isPending={isPending}
          isSuccess={isSuccess}
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
          <Skeleton className={'my-2 h-28 w-full'} />
          <Skeleton className={'my-2 h-28 w-full'} />
          <Skeleton className={'my-3 h-12 w-full'} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-2 py-8 sm:px-6 md:mt-5 lg:px-8">
      <h1 className="text-foreground page-title">Addresses</h1>
      <div className="my-2 px-1 py-2 md:my-4 md:mt-7">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          {userAddresses?.length > 0 ? (
            userAddresses.map((addr) => (
              <AddressCard key={addr.id} address={addr} showActions={true} />
            ))
          ) : (
            <div className="bg-muted font-heading w-full rounded-sm p-2 py-10 text-center font-semibold">
              no saved addresses
            </div>
          )}
        </motion.div>
        <div className="mt-7">
          <AddNewAddress />
        </div>
      </div>
    </div>
  );
};
export default AddressPage;
