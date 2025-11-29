import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, MinusCircle, Phone, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRemoveUserAddress, useUpdateUserAddress } from '@/hooks/user';
import { AddressModal } from './AddressModal';
import ResponsiveModal from '@/components/ui/modal/ResponsiveModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const EditAddressBtn = ({ address }) => {
  const {
    mutate: updatedAddress,
    isPending,
    isSuccess,
  } = useUpdateUserAddress();
  const [openModal, setOpenModal] = useState(false);

  return (
    <ResponsiveModal
      onOpenChange={setOpenModal}
      open={openModal}
      showCloseButton={true}
      trigger={
        <Button
          size="sm"
          variant="ghost"
          className="hover:bg-accent h-8 gap-1.5 text-xs font-medium"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit
        </Button>
      }
      title="Edit Address"
    >
      <AddressModal
        open={openModal}
        onOpenChange={setOpenModal}
        closeModal={() => setOpenModal(false)}
        address={address}
        onSubmit={updatedAddress}
        isPending={isPending}
        isSuccess={isSuccess}
      />
    </ResponsiveModal>
  );
};

const RemoveAddressBtn = ({ address }) => {
  const { mutate: deleteAddress, isPending } = useRemoveUserAddress();

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 gap-1.5 text-xs font-medium"
      onClick={() => deleteAddress(address.id)}
      disabled={isPending}
    >
      <MinusCircle className="h-3.5 w-3.5" />
      {isPending ? 'Removing...' : 'Remove'}
    </Button>
  );
};

const DefaultAddressBtn = ({ address }) => {
  const { mutate: makeDefault, isPending } = useUpdateUserAddress();

  function handleClick() {
    makeDefault(
      { id: address.id, isDefault: true },
      {
        onError: (error) => {
          toast.error(error?.message || 'Failed to set default address');
        },
      },
    );
  }

  if (address?.isDefault) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleClick}
      disabled={isPending}
      className="hover:bg-accent h-8 gap-1.5 text-xs font-medium"
    >
      {isPending ? 'Setting...' : 'Set as default'}
    </Button>
  );
};

export const AddressCard = ({ address, showActions, className, onClick }) => {
  return (
    <div
      className={cn(
        'group border-border bg-card hover:border-primary/50 focus-within:border-primary/50 focus-within:ring-ring/20 relative flex flex-col gap-1 rounded-xl border p-4 transition-all duration-200 focus-within:ring-2 hover:shadow-md sm:p-6',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-foreground text-base font-bold">
            {address.name}
          </span>
          {address.isDefault && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20"
            >
              Default
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex flex-col gap-1 text-base leading-relaxed font-medium">
          <span>
            <p className="max-w-[20ch]">{address.address}</p>
            <p>
              {address.city}, {address.state} - {address.pincode}
            </p>
            <p className="mt-1">+91 {address.phone}</p>
          </span>
        </div>
      </div>

      {!!showActions && (
        <div className="flex flex-wrap items-center gap-1 border-t pt-3 sm:gap-1.5">
          <DefaultAddressBtn address={address} />
          <EditAddressBtn address={address} />
          <RemoveAddressBtn address={address} />
        </div>
      )}
    </div>
  );
};
