import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItemWithDetails, UserProfile } from '@/types';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  clearAuth: () => void;
}

interface CartState {
  items: CartItemWithDetails[];
  addItem: (newItem: Omit<CartItemWithDetails, 'id' | 'subtotal' | 'quantity'> & { quantity: number }) => void;
  removeItem: (vegetableId: number) => void;
  updateQuantity: (vegetableId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

interface UIState {
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  toggleMobileMenu: () => void;
  setCartOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean, mode?: 'login' | 'register') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null) as any),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token && !!state.user;
        }
      },
    }
  )
);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((item) => item.vegetableId === newItem.vegetableId);
        
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.vegetableId === newItem.vegetableId
                ? {
                    ...item,
                    quantity: (parseFloat(item.quantity || "0") + newItem.quantity).toString(),
                    subtotal: (
                      (parseFloat(item.quantity || "0") + newItem.quantity) *
                      parseFloat(item.price?.toString() || "0") *
                      (1 - (item.discount || 0) / 100)
                    ).toFixed(2),
                  }
                : item
            ),
          });
        } else {
          const price = parseFloat(newItem.price?.toString() || "0");
          const subtotal = (
            newItem.quantity *
            price *
            (1 - (newItem.discount || 0) / 100)
          ).toFixed(2);
          
          set({
            items: [
              ...items,
              {
                ...newItem,
                id: Date.now(),
                quantity: newItem.quantity.toString(), // Now valid because quantity is a number
                subtotal,
              } as CartItemWithDetails,
            ],
          });
        }
      },
      
      removeItem: (vegetableId) => {
        set({
          items: get().items.filter((item) => item.vegetableId !== vegetableId),
        });
      },
      
      updateQuantity: (vegetableId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(vegetableId);
          return;
        }
        
        set({
          items: get().items.map((item) =>
            item.vegetableId === vegetableId
              ? {
                  ...item,
                  quantity: quantity.toString(),
                  subtotal: (
                    quantity *
                    parseFloat(item.price?.toString() || "0") *
                    (1 - (item.discount || 0) / 100)
                  ).toFixed(2),
                }
              : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + parseFloat(item.subtotal || "0"), 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + parseFloat(item.quantity || "0"), 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null) as any),
    }
  )
);

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  isAuthModalOpen: false,
  authModalMode: 'login',
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setAuthModalOpen: (open, mode = 'login') => set({ isAuthModalOpen: open, authModalMode: mode }),
}));