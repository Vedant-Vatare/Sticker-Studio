import { memo } from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useUserAddresses } from '@/hooks/user';
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
    length: 10,
    span: 'full',
  },
  {
    name: 'address',
    label: 'Address',
    placeholder: 'Flat/House number, Building, Street',
    span: 'full',
  },
  { name: 'city', label: 'City', placeholder: 'Enter city', span: 'half' },
  {
    name: 'pincode',
    label: 'Pincode',
    placeholder: 'Enter pincode',
    type: 'number',
    length: 6,
    span: 'half',
  },
  { name: 'state', label: 'State', placeholder: 'Enter state', span: 'full' },
];

const ShowConfirmationDialog = memo(
  ({ showConfirmDialog, setShowConfirmDialog, closeModal, resetForm }) => {
    const handleConfirmClose = () => {
      resetForm();
      setShowConfirmDialog(false);
      closeModal();
    };

    const handleCancelClose = () => {
      setShowConfirmDialog(false);
    };

    return (
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
    );
  },
);

// this modal is to be shown when updating or creating an address only
export const AddressModal = ({
  open,
  onOpenChange,
  closeModal,
  address = {},
  onSubmit,
  isPending,
  isSuccess,
}) => {
  const initialFormData = {
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    ...address,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isFormEdited = Object.keys(formData).some(
    (key) => formData[key] !== initialFormData[key],
  );

  // open confirmation dialog if user was editing and the form was not submitted
  useEffect(() => {
    if (!open && isFormEdited && !isSuccess && !showConfirmDialog) {
      onOpenChange(true);
      setShowConfirmDialog(true);
    }
  }, [open, isFormEdited, isSuccess, showConfirmDialog]);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, {
      onSuccess: () => {
        closeModal();
      },

      onError: (e) => {
        toast.error('Something went wrong');
      },
    });
  };

  return (
    <>
      <ShowConfirmationDialog
        showConfirmDialog={showConfirmDialog}
        closeModal={closeModal}
        setShowConfirmDialog={setShowConfirmDialog}
        resetForm={resetForm}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3 md:gap-4 md:gap-y-6">
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
                  className="bg-background text-foreground font-body absolute top-0 left-2 z-1 block -translate-y-1/2 rounded-md px-1 text-xs font-semibold tracking-wide md:text-sm"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  type={field.type}
                  maxLength={field.length}
                  minLength={field.length}
                  length={field.length}
                  required={field.required || true}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className="bg-muted h-10 w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </motion.div>
          ))}
        </div>
        <Button
          type="submit"
          className="mt-3 h-9 w-full rounded-sm"
          disabled={isPending || !isFormEdited}
        >
          {isPending ? 'Saving...' : 'Save Address'}
        </Button>
      </form>
    </>
  );
};
