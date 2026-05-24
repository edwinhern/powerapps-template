import type { ReplacementPart } from "./types"
import {
  addCartItem,
  getCartLineTotal,
  getCartTotal,
  removeCartItem,
  updateCartQuantity,
} from "./cart"

const availableFilter: ReplacementPart = {
  id: "part-filter",
  title: "Hydraulic Filter",
  partNumber: "HF-100",
  category: "Hydraulics",
  description: "Spin-on filter for lift systems",
  availability: "Available",
  unitCost: 47.5,
}

const outOfStockValve: ReplacementPart = {
  id: "part-valve",
  title: "Control Valve",
  partNumber: "CV-220",
  category: "Hydraulics",
  description: "Two-way control valve",
  availability: "Out of Stock",
  unitCost: 128,
}

describe("cart", () => {
  it("adds an available part and combines quantities", () => {
    const firstCart = addCartItem([], availableFilter, 2)
    const updatedCart = addCartItem(firstCart, availableFilter, 3)

    expect(updatedCart).toEqual([
      { part: availableFilter, quantity: 5 },
    ])
  })

  it("does not add out of stock parts", () => {
    expect(addCartItem([], outOfStockValve, 1)).toEqual([])
  })

  it("updates quantity, removes items, and totals the cart", () => {
    const cart = addCartItem([], availableFilter, 2)
    const adjustedCart = updateCartQuantity(cart, availableFilter.id, 4)

    expect(getCartLineTotal(adjustedCart[0])).toBe(190)
    expect(getCartTotal(adjustedCart)).toBe(190)
    expect(removeCartItem(adjustedCart, availableFilter.id)).toEqual([])
  })
})
