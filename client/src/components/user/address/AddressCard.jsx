import { motion } from 'motion/react';
import { Check, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRemoveUserAddress } from '@/hooks/user';

export const AddressCard = ({ address }) => {
  const { mutate: removeAddress, isPending } = useRemoveUserAddress();
  return (
    <motion.label
      htmlFor={address.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`group relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${!!isPending && 'animate-pulse'}`}
    >
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-foreground font-semibold">{address.name}</p>
          {address.isDefault && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-xs text-green-800"
            >
              Default
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {address.address}
        </p>
        <p className="text-muted-foreground text-sm">
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="text-muted-foreground mt-2 flex items-center gap-1 text-xs font-semibold">
          <span className="">Phone:</span> {address.phone}
        </p>
      </div>
      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button size="icon" variant="ghost">
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => removeAddress(address.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.label>
  );
};
