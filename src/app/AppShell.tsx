import { CartDrawer } from "@/components/cart-drawer"
import { useActiveScreen } from "@/features/parts/cart-store"
import type { Requestor } from "@/features/requests/types"
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

  return (
    <div className="mx-auto w-full max-w-6xl">
      {activeScreen === "status" ? (
        <RequestStatusScreen />
      ) : (
        <PartsCatalogScreen />
      )}
      <CartDrawer requestor={localRequestor} now={now} />
    </div>
  )
}
