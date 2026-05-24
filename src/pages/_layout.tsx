import { Outlet } from "react-router-dom"

import { SiteHeader } from "@/components/site-header"

export default function Layout() {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
