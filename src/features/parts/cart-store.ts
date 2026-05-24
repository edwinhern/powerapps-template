import { toast } from "sonner"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import {
  addCartItem,
  getCartTotal,
  removeCartItem,
  updateCartQuantity,
} from "@/features/parts/cart"
import type { CartItem, ReplacementPart } from "@/features/parts/types"
import { createEquipmentRequest } from "@/features/requests/request-store"
import type { EquipmentRequest, Requestor } from "@/features/requests/types"

export type ActiveScreen = "catalog" | "status"

type CartState = {
  items: CartItem[]
  requests: EquipmentRequest[]
  activeScreen: ActiveScreen
  isCartOpen: boolean
}

type CartActions = {
  addItem: (part: ReplacementPart, quantity?: number) => void
  updateQuantity: (partId: string, quantity: number) => void
  removeItem: (partId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  setActiveScreen: (screen: ActiveScreen) => void
  submitRequest: (input: {
    requestor: Requestor
    submittedAt: Date
  }) => EquipmentRequest | null
  reset: () => void
}

export type CartStore = CartState & CartActions

const initialState: CartState = {
  items: [],
  requests: [],
  activeScreen: "catalog",
  isCartOpen: false,
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (part, quantity = 1) => {
        const previous = get().items
        const next = addCartItem(previous, part, quantity)
        if (next === previous) {
          return
        }
        set({ items: next })
        toast.success(`Added ${part.title} to cart`)
      },

      updateQuantity: (partId, quantity) =>
        set((state) => ({
          items: updateCartQuantity(state.items, partId, quantity),
        })),

      removeItem: (partId) =>
        set((state) => ({ items: removeCartItem(state.items, partId) })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isCartOpen: true }),

      closeCart: () => set({ isCartOpen: false }),

      setActiveScreen: (screen) =>
        set({ activeScreen: screen, isCartOpen: false }),

      submitRequest: ({ requestor, submittedAt }) => {
        const state = get()
        if (state.items.length === 0) {
          return null
        }
        const request = createEquipmentRequest({
          cartItems: state.items,
          requestor,
          submittedAt,
          requestNumber: state.requests.length + 1,
        })
        set({
          requests: [request, ...state.requests],
          items: [],
          activeScreen: "status",
          isCartOpen: false,
        })
        return request
      },

      reset: () => set(initialState),
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        items: state.items,
        requests: state.requests,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as
          | Partial<Pick<CartState, "items" | "requests">>
          | undefined
        const requests = (persisted?.requests ?? []).map((request) => ({
          ...request,
          submissionDate: new Date(request.submissionDate),
          approvalDate: request.approvalDate
            ? new Date(request.approvalDate)
            : null,
        }))
        return {
          ...currentState,
          items: persisted?.items ?? currentState.items,
          requests,
        }
      },
    },
  ),
)

export const useCartItems = () => useCartStore((state) => state.items)

export const useCartCount = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )

export const useCartTotal = () =>
  useCartStore((state) => getCartTotal(state.items))

export const useIsCartOpen = () => useCartStore((state) => state.isCartOpen)

export const useActiveScreen = () => useCartStore((state) => state.activeScreen)

export const useRequests = () => useCartStore((state) => state.requests)
