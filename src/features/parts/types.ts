export type PartAvailability = "Available" | "Out of Stock"

export type ReplacementPart = {
  id: string
  title: string
  partNumber: string
  category: string
  description: string
  availability: PartAvailability
  unitCost: number
}

export type CartItem = {
  part: ReplacementPart
  quantity: number
}
