const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatRequestId(submittedAt: Date, requestNumber: number) {
  const year = submittedAt.getUTCFullYear()
  const month = String(submittedAt.getUTCMonth() + 1).padStart(2, "0")
  const day = String(submittedAt.getUTCDate()).padStart(2, "0")
  const sequence = String(requestNumber).padStart(3, "0")

  return `REQ-${year}${month}${day}-${sequence}`
}
