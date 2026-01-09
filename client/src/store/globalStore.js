import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const breadcrumbStore = create((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));

export const checkoutOrderStore = create(
  persist(
    (set) => ({
      orderItems: [],
      setOrderItem: (orderItems) => set({ orderItems }),
    }),
    {
      name: 'checkout-order-items',
    },
  ),
);
