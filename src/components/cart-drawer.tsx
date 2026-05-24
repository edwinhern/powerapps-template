import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { getCartLineTotal } from "@/features/parts/cart"
import {
  useCartCount,
  useCartItems,
  useCartStore,
  useCartTotal,
  useIsCartOpen,
} from "@/features/parts/cart-store"
import type { Requestor } from "@/features/requests/types"
import { formatCurrency } from "@/lib/format"

type CartDrawerProps = {
  requestor: Requestor
  now?: () => Date
}

export function CartDrawer({
  requestor,
  now = () => new Date(),
}: CartDrawerProps) {
  const isOpen = useIsCartOpen()
  const items = useCartItems()
  const total = useCartTotal()
  const count = useCartCount()
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const closeCart = useCartStore((state) => state.closeCart)
  const submitRequest = useCartStore((state) => state.submitRequest)
  const setActiveScreen = useCartStore((state) => state.setActiveScreen)

  function handleSubmit() {
    const request = submitRequest({ requestor, submittedAt: now() })
    if (request) {
      setActiveScreen("status")
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? null : closeCart())}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            Your cart
          </SheetTitle>
          <SheetDescription>
            {count === 0
              ? "No parts queued yet."
              : `${count} ${count === 1 ? "part" : "parts"} ready for review.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart />}
              title="Cart is empty"
              description="Browse the catalog and add available parts to start a request."
              action={
                <Button
                  variant="outline"
                  onClick={() => setActiveScreen("catalog")}
                >
                  Browse parts
                </Button>
              }
            />
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.part.id}
                  className="bg-card rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {item.part.title}
                      </p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {item.part.partNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.part.title}`}
                      onClick={() => removeItem(item.part.id)}
                      className="text-muted-foreground hover:text-destructive rounded-md p-1 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="bg-muted inline-flex items-center gap-1 rounded-full p-1">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.part.title}`}
                        onClick={() =>
                          updateQuantity(item.part.id, item.quantity - 1)
                        }
                        className="hover:bg-background grid size-7 place-items-center rounded-full transition-colors"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.part.title}`}
                        onClick={() =>
                          updateQuantity(item.part.id, item.quantity + 1)
                        }
                        className="hover:bg-background grid size-7 place-items-center rounded-full transition-colors"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(getCartLineTotal(item))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <SheetFooter>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated total</span>
              <span className="text-2xl font-bold">
                {formatCurrency(total)}
              </span>
            </div>
            <Button
              size="field"
              variant="brand"
              className="w-full"
              onClick={handleSubmit}
            >
              Submit request
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
