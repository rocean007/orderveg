import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItemWithDetails, UserProfile } from '@/types';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  setAuth: (token: string, user: UserProfile) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

interface CartState {
  items: CartItemWithDetails[];
  addItem: (item: Omit<CartItemWithDetails, 'id' | 'subtotal'> & { quantity: number }) => void;
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

// Auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Cart store with persistence (for non-logged in users)
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((item) => item.vegetableId === newItem.vegetableId);
        
        if (existingItem) {
          // Update quantity if item exists
          set({
            items: items.map((item) =>
              item.vegetableId === newItem.vegetableId
                ? {
                    ...item,
                    quantity: (parseFloat(item.quantity) + newItem.quantity).toString(),
                    subtotal: (
                      (parseFloat(item.quantity) + newItem.quantity) *
                      parseFloat(item.price) *
                      (1 - (item.discount || 0) / 100)
                    ).toFixed(2),
                  }
                : item
            ),
          });
        } else {
          // Add new item
          const subtotal = (
            newItem.quantity *
            parseFloat(newItem.price) *
            (1 - (newItem.discount || 0) / 100)
          ).toFixed(2);
          
          set({
            items: [
              ...items,
              {
                ...newItem,
                id: Date.now(), // Temporary ID for local cart
                quantity: newItem.quantity.toString(),
                subtotal,
              },
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
                    parseFloat(item.price) *
                    (1 - (item.discount || 0) / 100)
                  ).toFixed(2),
                }
              : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + parseFloat(item.subtotal), 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + parseFloat(item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// UI state store (not persisted)
export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCartOpen: false,
  isAuthModalOpen: false,
  authModalMode: 'login',
  
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  setCartOpen: (open) => set({ isCartOpen: open }),
  
  setAuthModalOpen: (open, mode = 'login') => 
    set({ isAuthModalOpen: open, authModalMode: mode }),
}));
