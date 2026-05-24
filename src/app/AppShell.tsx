import { ClipboardList, PackageSearch, ShoppingCart } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  addCartItem,
  removeCartItem,
  updateCartQuantity,
} from "@/features/parts/cart"
import { mockParts } from "@/features/parts/mock-parts"
import type { CartItem, ReplacementPart } from "@/features/parts/types"
import { createEquipmentRequest } from "@/features/requests/request-store"
import type { EquipmentRequest, Requestor } from "@/features/requests/types"
import { cn } from "@/lib/utils"
import { CartScreen } from "@/screens/CartScreen"
import { PartsCatalogScreen } from "@/screens/PartsCatalogScreen"
import { RequestStatusScreen } from "@/screens/RequestStatusScreen"

type ActiveScreen = "catalog" | "cart" | "status"

type AppShellProps = {
  now?: () => Date
}

const localRequestor: Requestor = {
  name: "Field Crew User",
  email: "field.crew@example.com",
}

export function AppShell({ now = () => new Date() }: AppShellProps) {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("catalog")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [requests, setRequests] = useState<EquipmentRequest[]>([])
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  function handleAddPart(part: ReplacementPart) {
    setCartItems((currentItems) => addCartItem(currentItems, part))
  }

  function handleUpdateQuantity(partId: string, quantity: number) {
    setCartItems((currentItems) => updateCartQuantity(currentItems, partId, quantity))
  }

  function handleRemoveItem(partId: string) {
    setCartItems((currentItems) => removeCartItem(currentItems, partId))
  }

  function handleSubmitRequest() {
    if (cartItems.length === 0) {
      return
    }

    const request = createEquipmentRequest({
      cartItems,
      requestor: localRequestor,
      submittedAt: now(),
      requestNumber: requests.length + 1,
    })

    setRequests((currentRequests) => [request, ...currentRequests])
    setCartItems([])
    setActiveScreen("status")
  }

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-950">
      <main className="mx-auto min-h-dvh w-full max-w-6xl bg-white shadow-2xl shadow-slate-300/60">
        {activeScreen === "catalog" ? (
          <PartsCatalogScreen
            parts={mockParts}
            cartCount={cartCount}
            onAddPart={handleAddPart}
          />
        ) : null}
        {activeScreen === "cart" ? (
          <CartScreen
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onSubmitRequest={handleSubmitRequest}
          />
        ) : null}
        {activeScreen === "status" ? <RequestStatusScreen requests={requests} /> : null}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-white/95 px-3 py-3 shadow-2xl backdrop-blur">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <NavButton
            active={activeScreen === "catalog"}
            icon={<PackageSearch />}
            label="Catalog"
            onClick={() => setActiveScreen("catalog")}
          />
          <NavButton
            active={activeScreen === "cart"}
            icon={<ShoppingCart />}
            label={`Cart ${cartCount}`}
            onClick={() => setActiveScreen("cart")}
          />
          <NavButton
            active={activeScreen === "status"}
            icon={<ClipboardList />}
            label={`Status ${requests.length}`}
            onClick={() => setActiveScreen("status")}
          />
        </div>
      </nav>
    </div>
  )
}

type NavButtonProps = {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}

function NavButton({ active, icon, label, onClick }: NavButtonProps) {
  return (
    <Button
      aria-pressed={active}
      className={cn("h-14 flex-col gap-1 rounded-2xl text-xs", active && "bg-slate-950 text-white")}
      variant={active ? "default" : "ghost"}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  )
}
