import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useAddUserAddress, useUserAddresses } from '@/hooks/user';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';

const fields = [
  {
    name: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    span: 'full',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter phone number',
    type: 'tel',
    maxLength: 10,
    span: 'full',
  },
  {
    name: 'address',
    label: 'Street Address',
    placeholder: 'Flat/House number, Building, Street',
    span: 'full',
  },
  { name: 'city', label: 'City', placeholder: 'Enter city', span: 'half' },
  {
    name: 'pincode',
    label: 'Pincode',
    placeholder: 'Enter pincode',
    type: 'text',
    maxLength: 6,
    span: 'half',
  },
  { name: 'state', label: 'State', placeholder: 'Enter state', span: 'full' },
];
export const AddNewAddressModal = ({ closeModal, open, onOpenChange }) => {
  const { mutate: addNewAddress, isPending, isSuccess } = useAddUserAddress();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const hasFormData = Object.values(formData).some((field) => field.length > 0);

  useEffect(() => {
    if (!open && hasFormData && !isSuccess) {
      setShowConfirmDialog(true);
      onOpenChange(true);
    }
  }, [open]);

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setFormData({
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
    closeModal();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    addNewAddress(formData, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const { data: addresses } = useUserAddresses();
  useEffect(() => {
    if (addresses?.length >= 3) {
      toast.error('Address limit reached (3 max).');
      closeModal();
    }
  }, [addresses?.length]);

  return (
    <>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to close?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className={'bg-destructive/80 text-white'}
              onClick={handleConfirmClose}
            >
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          {fields.map((field, i) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`space-y-1 ${field.span === 'full' ? 'col-span-2' : 'col-span-1'}`}
            >
              <div className="group relative w-full">
                <Label
                  htmlFor={field.name}
                  className="bg-background text-foreground font-body absolute top-0 left-2 z-1 block -translate-y-1/2 rounded-md px-1 text-xs font-semibold tracking-wide"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  maxLength={field.maxLength || undefined}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className="bg-muted/50 h-10 w-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
        <Button
          type="submit"
          className="mt-3 h-9 w-full rounded-sm"
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save Address'}
        </Button>
      </form>
    </>
  );
};
