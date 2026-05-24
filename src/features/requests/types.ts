export type RequestStatus = "Pending" | "Approved" | "Rejected"

export type Requestor = {
  name: string
  email: string
}

export type RequestedPart = {
  partName: string
  partNumber: string
  quantity: number
  unitCost: number
  lineTotal: number
}

export type EquipmentRequest = {
  id: string
  requestorName: string
  requestorEmail: string
  requestedParts: RequestedPart[]
  totalEstimatedCost: number
  status: RequestStatus
  submissionDate: Date
  approvalDate: Date | null
  approverComments: string
}
