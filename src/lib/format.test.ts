import { formatCurrency, formatRequestId } from "./format"

describe("formatCurrency", () => {
  it("formats unit and total costs as US dollars", () => {
    expect(formatCurrency(47.5)).toBe("$47.50")
    expect(formatCurrency(1280)).toBe("$1,280.00")
  })
})

describe("formatRequestId", () => {
  it("formats a request number for field crew status lookup", () => {
    const submittedAt = new Date("2026-05-21T15:30:00.000Z")

    expect(formatRequestId(submittedAt, 7)).toBe("REQ-20260521-007")
  })
})
