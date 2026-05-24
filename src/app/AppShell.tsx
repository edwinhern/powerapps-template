import { ClipboardList, PackageSearch, ShoppingCart } from "lucide-react"

import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import {
  useActiveScreen,
  useCartCount,
  useCartStore,
  useRequests,
} from "@/features/parts/cart-store"
import type { Requestor } from "@/features/requests/types"
import { cn } from "@/lib/utils"
import { CartScreen } from "@/screens/CartScreen"
import { PartsCatalogScreen } from "@/screens/PartsCatalogScreen"
import { RequestStatusScreen } from "@/screens/RequestStatusScreen"

type AppShellProps = {
  now?: () => Date
}

const localRequestor: Requestor = {
  name: "Field Crew User",
  email: "field.crew@example.com",
}

export function AppShell({ now = () => new Date() }: AppShellProps) {
  const activeScreen = useActiveScreen()
  const cartCount = useCartCount()
  const requestCount = useRequests().length
  const setActiveScreen = useCartStore((state) => state.setActiveScreen)

  return (
    <div className="mx-auto w-full max-w-6xl">
      {activeScreen === "catalog" ? <PartsCatalogScreen /> : null}
      {activeScreen === "cart" ? (
        <CartScreen requestor={localRequestor} now={now} />
      ) : null}
      {activeScreen === "status" ? <RequestStatusScreen /> : null}

      <CartDrawer requestor={localRequestor} now={now} />

      <nav className="bg-card/95 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-1 px-3 py-2">
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
            label={`Status ${requestCount}`}
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
      className={cn(
        "h-14 flex-col gap-1 rounded-lg text-xs",
        active && "bg-primary text-primary-foreground",
      )}
      variant={active ? "default" : "ghost"}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  )
}
