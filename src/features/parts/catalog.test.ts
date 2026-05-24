import type { ReplacementPart } from "./types"
import { filterParts } from "./catalog"

const parts: ReplacementPart[] = [
  {
    id: "part-filter",
    title: "Hydraulic Filter",
    partNumber: "HF-100",
    category: "Hydraulics",
    description: "Spin-on filter for lift systems",
    availability: "Available",
    unitCost: 47.5,
  },
  {
    id: "part-battery",
    title: "Battery Pack",
    partNumber: "BP-24V",
    category: "Electrical",
    description: "24V battery pack for lift controls",
    availability: "Available",
    unitCost: 312,
  },
]

describe("filterParts", () => {
  it("matches part name, number, or category", () => {
    expect(filterParts(parts, "hydraulic")).toEqual([parts[0]])
    expect(filterParts(parts, "bp-24")).toEqual([parts[1]])
    expect(filterParts(parts, "electrical")).toEqual([parts[1]])
  })

  it("returns all parts when the search is blank", () => {
    expect(filterParts(parts, "  ")).toEqual(parts)
  })
})
