import { Minus, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCartLineTotal, getCartTotal } from "@/features/parts/cart"
import type { CartItem } from "@/features/parts/types"
import { formatCurrency } from "@/lib/format"

type CartScreenProps = {
  cartItems: CartItem[]
  onUpdateQuantity: (partId: string, quantity: number) => void
  onRemoveItem: (partId: string) => void
  onSubmitRequest: () => void
}

export function CartScreen({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitRequest,
}: CartScreenProps) {
  const cartTotal = getCartTotal(cartItems)

  return (
    <section className="space-y-5 px-4 pb-28 pt-8 sm:px-6">
      <div>
        <p className="text-sm font-medium text-cyan-700">Review request</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Shopping cart</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Check quantities before submitting to the approver queue.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <Card className="border-dashed text-center">
          <CardContent className="space-y-3 py-10">
            <p className="text-lg font-semibold">No parts in the cart</p>
            <p className="text-sm text-muted-foreground">
              Add available parts from the catalog to start a request.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.part.id} className="py-0 shadow-sm">
              <CardHeader className="px-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{item.part.title}</CardTitle>
                    <CardDescription className="font-mono">
                      {item.part.partNumber}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{formatCurrency(item.part.unitCost)} each</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-5 pb-5">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-2">
                  <div className="flex items-center gap-2">
                    <Button
                      aria-label={`Decrease ${item.part.title}`}
                      size="icon-lg"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.part.id, item.quantity - 1)}
                    >
                      <Minus />
                    </Button>
                    <span className="w-10 text-center text-lg font-semibold">{item.quantity}</span>
                    <Button
                      aria-label={`Increase ${item.part.title}`}
                      size="icon-lg"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.part.id, item.quantity + 1)}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    aria-label={`Remove ${item.part.title}`}
                    size="icon-lg"
                    variant="ghost"
                    onClick={() => onRemoveItem(item.part.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Line total</span>
                  <span className="text-lg font-semibold">{formatCurrency(getCartLineTotal(item))}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border-cyan-200 bg-cyan-50 py-0">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-cyan-900">Estimated total</span>
                <span className="text-2xl font-bold text-cyan-950">{formatCurrency(cartTotal)}</span>
              </div>
              <Button className="h-12 w-full rounded-2xl text-base" onClick={onSubmitRequest}>
                Submit request
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}
