import { Outlet } from "react-router-dom"

import { CartDrawer } from "@/components/cart-drawer"
import { SiteHeader } from "@/components/site-header"
import type { Requestor } from "@/features/requests/types"

const localRequestor: Requestor = {
  name: "Field Crew User",
  email: "field.crew@example.com",
}

export default function Layout() {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1">
        <Outlet />
      </main>
      <CartDrawer requestor={localRequestor} />
    </div>
  )
}
