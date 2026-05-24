import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach } from "vitest"

import { useCartStore } from "@/features/parts/cart-store"
import { AppShell } from "./AppShell"

describe("AppShell", () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
    useCartStore.getState().reset()
  })

  it("searches by part number and keeps out of stock parts unavailable", () => {
    render(<AppShell now={() => new Date("2026-05-21T15:30:00.000Z")} />)

    fireEvent.change(screen.getByLabelText("Search parts"), {
      target: { value: "CV-220" },
    })

    expect(screen.getByText("Control Valve")).toBeInTheDocument()
    expect(screen.queryByText("Hydraulic Filter")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Out of stock" })).toBeDisabled()
  })

  it("submits cart items and shows the pending request", () => {
    render(<AppShell now={() => new Date("2026-05-21T15:30:00.000Z")} />)

    fireEvent.click(screen.getByRole("button", { name: "Add Hydraulic Filter" }))
    fireEvent.click(screen.getByRole("button", { name: "Cart 1" }))

    expect(screen.getByText("Estimated total")).toBeInTheDocument()
    expect(screen.getAllByText("$47.50")).toHaveLength(2)

    fireEvent.click(screen.getByRole("button", { name: "Submit request" }))

    expect(screen.getByText("REQ-20260521-001")).toBeInTheDocument()
    expect(screen.getByText("Pending")).toBeInTheDocument()
    expect(screen.getByText("Hydraulic Filter x 1")).toBeInTheDocument()
  })
})
