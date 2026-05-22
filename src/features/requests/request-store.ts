import { getCartLineTotal, getCartTotal } from "@/features/parts/cart"
import type { CartItem } from "@/features/parts/types"
import { formatRequestId } from "@/lib/format"
import type { EquipmentRequest, Requestor } from "./types"

type CreateEquipmentRequestInput = {
  cartItems: CartItem[]
  requestor: Requestor
  submittedAt: Date
  requestNumber: number
}

export function createEquipmentRequest({
  cartItems,
  requestor,
  submittedAt,
  requestNumber,
}: CreateEquipmentRequestInput): EquipmentRequest {
  return {
    id: formatRequestId(submittedAt, requestNumber),
    requestorName: requestor.name,
    requestorEmail: requestor.email,
    requestedParts: cartItems.map((item) => ({
      partName: item.part.title,
      partNumber: item.part.partNumber,
      quantity: item.quantity,
      unitCost: item.part.unitCost,
      lineTotal: getCartLineTotal(item),
    })),
    totalEstimatedCost: getCartTotal(cartItems),
    status: "Pending",
    submissionDate: submittedAt,
    approvalDate: null,
    approverComments: "",
  }
}
