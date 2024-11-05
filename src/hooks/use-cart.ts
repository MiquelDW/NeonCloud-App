import { ProductType } from "@/components/Product/ProductReel";
import { create } from "zustand";
// make state persistent using localstorage with 'persist' method
import { createJSONStorage, persist } from "zustand/middleware";

// type of a cart item
export type CartItem = {
  product: ProductType;
};

// type of state that 'useCart' hooks needs to keep track of
type CartState = {
  items: CartItem[]; // var keeps track of cart's current state
  addItem: (product: ProductType) => void; // adds product to cart
  removeItem: (productId: string) => void; // removes specific product from cart
  clearCart: () => void; // clears cart from all added products
};

// create custom hook / store that holds and manages (cart) state
export const useCart = create<CartState>()(
  persist(
    // given 'set' function is used to update 'items' state
    (set) => ({
      // defined 'items' array is empty by default
      items: [],
      // defined and returned functions update the 'items' state
      addItem: (product) =>
        // add product to 'items' state (add to cart)
        set((state) => {
          return { items: [...state.items, { product }] };
        }),
      removeItem: (id) =>
        // remove given product from 'items' state (remove from cart)
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      // remove all products from 'items' state (remove all from cart)
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // how state will appear in local storage
      storage: createJSONStorage(() => localStorage), // create JSON local storage where state will be stored
    },
  ),
);
