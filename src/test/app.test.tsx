import { act, fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { beforeEach } from "vitest"

import { CartDrawer } from "@/components/cart-drawer"
import { useCartStore } from "@/features/parts/cart-store"
import type { Requestor } from "@/features/requests/types"
import HomePage from "@/pages/home"
import RequestsPage from "@/pages/requests"

const testRequestor: Requestor = {
  name: "Field Crew User",
  email: "field.crew@example.com",
}

function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/requests" element={<RequestsPage />} />
      </Routes>
      <CartDrawer
        requestor={testRequestor}
        now={() => new Date("2026-05-21T15:30:00.000Z")}
      />
    </MemoryRouter>,
  )
}

describe("Parts app", () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
    useCartStore.getState().reset()
  })

  it("searches by part number and keeps out of stock parts unavailable", () => {
    renderApp()

    fireEvent.change(screen.getByLabelText("Search parts"), {
      target: { value: "CV-220" },
    })

    expect(screen.getByText("Control Valve")).toBeInTheDocument()
    expect(screen.queryByText("Hydraulic Filter")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Out of stock" })).toBeDisabled()
  })

  it("submits cart items via the drawer and shows the pending request", () => {
    renderApp()

    fireEvent.click(screen.getByRole("button", { name: "Add Hydraulic Filter" }))
    act(() => {
      useCartStore.getState().openCart()
    })

    expect(screen.getByText("Estimated total")).toBeInTheDocument()
    expect(screen.getAllByText("$47.50").length).toBeGreaterThanOrEqual(2)

    fireEvent.click(screen.getByRole("button", { name: "Submit request" }))

    expect(screen.getByText("REQ-20260521-001")).toBeInTheDocument()
    expect(screen.getByText("Pending")).toBeInTheDocument()
    expect(screen.getByText("Hydraulic Filter x 1")).toBeInTheDocument()
  })
})
