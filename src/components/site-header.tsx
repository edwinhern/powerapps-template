import { ClipboardList, Package, ShoppingCart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  useActiveScreen,
  useCartCount,
  useCartStore,
  useRequests,
} from "@/features/parts/cart-store"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const cartCount = useCartCount()
  const activeScreen = useActiveScreen()
  const requestCount = useRequests().length
  const setActiveScreen = useCartStore((state) => state.setActiveScreen)
  const openCart = useCartStore((state) => state.openCart)

  return (
    <header className="bg-card/95 sticky top-0 z-30 border-b backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setActiveScreen("catalog")}
          className="flex items-center gap-2 text-left"
        >
          <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-lg">
            <Package className="size-5" />
          </span>
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            Parts Catalog
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          <HeaderLink
            label="Catalog"
            active={activeScreen === "catalog"}
            onClick={() => setActiveScreen("catalog")}
          />
          <HeaderLink
            label={`Requests${requestCount ? ` (${requestCount})` : ""}`}
            active={activeScreen === "status"}
            onClick={() => setActiveScreen("status")}
          />
        </nav>

        <Button
          variant="outline"
          size="field"
          aria-label="Open shopping cart"
          onClick={openCart}
          className="relative"
        >
          <ShoppingCart className="size-4" />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 ? (
            <Badge
              variant="destructive"
              className="absolute -top-1.5 -right-1.5 h-5 min-w-5 rounded-full px-1.5 text-[11px] font-semibold"
            >
              {cartCount}
            </Badge>
          ) : null}
        </Button>
      </div>
    </header>
  )
}

type HeaderLinkProps = {
  label: string
  active: boolean
  onClick: () => void
}

function HeaderLink({ label, active, onClick }: HeaderLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      <span className="inline-flex items-center gap-2">
        {label === "Catalog" ? <Package className="size-4" /> : null}
        {label.startsWith("Requests") ? (
          <ClipboardList className="size-4" />
        ) : null}
        {label}
      </span>
    </button>
  )
}
