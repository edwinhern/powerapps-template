import { ClipboardList, Package, PackageSearch, ShoppingCart } from "lucide-react"
import { NavLink } from "react-router-dom"

import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  useCartCount,
  useCartStore,
  useRequests,
} from "@/features/parts/cart-store"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const cartCount = useCartCount()
  const requestCount = useRequests().length
  const openCart = useCartStore((state) => state.openCart)

  return (
    <header className="bg-card/95 sticky top-0 z-30 border-b backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <NavLink to="/" end className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-lg">
            <Package className="size-5" />
          </span>
          <span className="hidden text-base font-semibold tracking-tight sm:inline sm:text-lg">
            Parts Catalog
          </span>
        </NavLink>

        <nav className="ml-auto flex items-center gap-1">
          <HeaderNavLink to="/" end icon={<PackageSearch className="size-4" />} label="Catalog" />
          <HeaderNavLink
            to="/requests"
            icon={<ClipboardList className="size-4" />}
            label={`Requests${requestCount ? ` (${requestCount})` : ""}`}
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

type HeaderNavLinkProps = {
  to: string
  end?: boolean
  icon: React.ReactNode
  label: string
}

function HeaderNavLink({ to, end, icon, label }: HeaderNavLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          "inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors sm:px-3",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
        )
      }
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  )
}
