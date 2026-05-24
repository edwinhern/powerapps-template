import type { CartItem } from "@/features/parts/types"
import { createEquipmentRequest } from "./request-store"

const cartItems: CartItem[] = [
  {
    part: {
      id: "part-filter",
      title: "Hydraulic Filter",
      partNumber: "HF-100",
      category: "Hydraulics",
      description: "Spin-on filter for lift systems",
      availability: "Available",
      unitCost: 47.5,
    },
    quantity: 2,
  },
]

describe("createEquipmentRequest", () => {
  it("creates a pending request from the submitted cart", () => {
    const request = createEquipmentRequest({
      cartItems,
      requestor: {
        name: "Jordan Lee",
        email: "jordan.lee@example.com",
      },
      submittedAt: new Date("2026-05-21T15:30:00.000Z"),
      requestNumber: 7,
    })

    expect(request).toEqual({
      id: "REQ-20260521-007",
      requestorName: "Jordan Lee",
      requestorEmail: "jordan.lee@example.com",
      requestedParts: [
        {
          partName: "Hydraulic Filter",
          partNumber: "HF-100",
          quantity: 2,
          unitCost: 47.5,
          lineTotal: 95,
        },
      ],
      totalEstimatedCost: 95,
      status: "Pending",
      submissionDate: new Date("2026-05-21T15:30:00.000Z"),
      approvalDate: null,
      approverComments: "",
    })
  })
})
