import { AddressCard } from './AddressCard';

export const AddressList = ({ addresses, showActions = true }) => (
  <div className="space-y-3">
    {addresses.map((addr) => (
      <AddressCard key={addr.id} address={addr} showActions={showActions} />
    ))}
  </div>
);
