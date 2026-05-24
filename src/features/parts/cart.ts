import type { CartItem, ReplacementPart } from "./types"

function normalizeQuantity(quantity: number) {
  return Math.max(1, Math.floor(quantity))
}

export function addCartItem(
  cartItems: CartItem[],
  part: ReplacementPart,
  quantity = 1,
) {
  if (part.availability !== "Available") {
    return cartItems
  }

  const nextQuantity = normalizeQuantity(quantity)
  const existingItem = cartItems.find((item) => item.part.id === part.id)

  if (!existingItem) {
    return [...cartItems, { part, quantity: nextQuantity }]
  }

  return cartItems.map((item) =>
    item.part.id === part.id
      ? { ...item, quantity: item.quantity + nextQuantity }
      : item,
  )
}

export function updateCartQuantity(
  cartItems: CartItem[],
  partId: string,
  quantity: number,
) {
  return cartItems.map((item) =>
    item.part.id === partId
      ? { ...item, quantity: normalizeQuantity(quantity) }
      : item,
  )
}

export function removeCartItem(cartItems: CartItem[], partId: string) {
  return cartItems.filter((item) => item.part.id !== partId)
}

export function getCartLineTotal(item: CartItem) {
  return item.part.unitCost * item.quantity
}

export function getCartTotal(cartItems: CartItem[]) {
  return cartItems.reduce((total, item) => total + getCartLineTotal(item), 0)
}
