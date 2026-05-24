import { ClipboardList, Package, PackageSearch, ShoppingCart } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
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
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setActiveScreen("catalog")}
          className="flex items-center gap-2 text-left"
        >
          <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-lg">
            <Package className="size-5" />
          </span>
          <span className="hidden text-base font-semibold tracking-tight sm:inline sm:text-lg">
            Parts Catalog
          </span>
        </button>

        <nav className="ml-auto flex items-center gap-1">
          <HeaderNavButton
            icon={<PackageSearch className="size-4" />}
            label="Catalog"
            active={activeScreen === "catalog"}
            onClick={() => setActiveScreen("catalog")}
          />
          <HeaderNavButton
            icon={<ClipboardList className="size-4" />}
            label={`Requests${requestCount ? ` (${requestCount})` : ""}`}
            active={activeScreen === "status"}
            onClick={() => setActiveScreen("status")}
          />
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            size="field"
            aria-label={`Cart ${cartCount}`}
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
      </div>
    </header>
  )
}

type HeaderNavButtonProps = {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}

function HeaderNavButton({ icon, label, active, onClick }: HeaderNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors sm:px-3",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}
