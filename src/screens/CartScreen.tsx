import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCartLineTotal } from "@/features/parts/cart"
import {
  useCartItems,
  useCartStore,
  useCartTotal,
} from "@/features/parts/cart-store"
import type { Requestor } from "@/features/requests/types"
import { formatCurrency } from "@/lib/format"

type CartScreenProps = {
  requestor: Requestor
  now?: () => Date
}

export function CartScreen({
  requestor,
  now = () => new Date(),
}: CartScreenProps) {
  const cartItems = useCartItems()
  const cartTotal = useCartTotal()
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const submitRequest = useCartStore((state) => state.submitRequest)
  const setActiveScreen = useCartStore((state) => state.setActiveScreen)

  function handleSubmit() {
    submitRequest({ requestor, submittedAt: now() })
  }

  return (
    <section className="space-y-5 px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
      <div>
        <p className="text-muted-foreground text-sm font-medium">
          Review request
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Shopping cart
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Check quantities before submitting to the approver queue.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart />}
          title="No parts in the cart"
          description="Add available parts from the catalog to start a request."
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
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.part.id} className="gap-3 py-0">
              <CardHeader className="px-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{item.part.title}</CardTitle>
                    <CardDescription className="font-mono">
                      {item.part.partNumber}
                    </CardDescription>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {formatCurrency(item.part.unitCost)} each
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-5 pb-5">
                <div className="bg-muted flex items-center justify-between rounded-2xl p-2">
                  <div className="flex items-center gap-1">
                    <Button
                      aria-label={`Decrease ${item.part.title}`}
                      size="icon-lg"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() =>
                        updateQuantity(item.part.id, item.quantity - 1)
                      }
                    >
                      <Minus />
                    </Button>
                    <span className="w-10 text-center text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      aria-label={`Increase ${item.part.title}`}
                      size="icon-lg"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() =>
                        updateQuantity(item.part.id, item.quantity + 1)
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    aria-label={`Remove ${item.part.title}`}
                    size="icon-lg"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => removeItem(item.part.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Line total</span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(getCartLineTotal(item))}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-primary text-primary-foreground gap-4 border-0 py-0">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-primary-foreground/80 text-sm font-medium">
                  Estimated total
                </span>
                <span className="text-2xl font-bold">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
              <Button
                size="field"
                variant="secondary"
                className="w-full"
                onClick={handleSubmit}
              >
                Submit request
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}
