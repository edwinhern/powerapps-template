import { CheckCircle2, Clock3, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { EquipmentRequest, RequestStatus } from "@/features/requests/types"
import { formatCurrency } from "@/lib/format"

type RequestStatusScreenProps = {
  requests: EquipmentRequest[]
}

function statusIcon(status: RequestStatus) {
  if (status === "Approved") {
    return <CheckCircle2 className="size-4" />
  }

  if (status === "Rejected") {
    return <XCircle className="size-4" />
  }

  return <Clock3 className="size-4" />
}

export function RequestStatusScreen({ requests }: RequestStatusScreenProps) {
  return (
    <section className="space-y-5 px-4 pb-28 pt-8 sm:px-6">
      <div>
        <p className="text-sm font-medium text-cyan-700">Submitted requests</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Request status</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track pending approvals and read approver comments when they are added.
        </p>
      </div>

      {requests.length === 0 ? (
        <Card className="border-dashed text-center">
          <CardContent className="space-y-3 py-10">
            <p className="text-lg font-semibold">No submitted requests yet</p>
            <p className="text-sm text-muted-foreground">
              Submitted carts appear here as read-only requests.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="py-0 shadow-sm">
              <CardHeader className="gap-3 px-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{request.id}</CardTitle>
                    <CardDescription>
                      Submitted by {request.requestorName}
                    </CardDescription>
                  </div>
                  <Badge className="gap-1">
                    {statusIcon(request.status)}
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-5 pb-5">
                <div className="space-y-2">
                  {request.requestedParts.map((part) => (
                    <div
                      key={`${request.id}-${part.partNumber}`}
                      className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{part.partName} x {part.quantity}</p>
                        <p className="font-mono text-muted-foreground">{part.partNumber}</p>
                      </div>
                      <span className="font-semibold">{formatCurrency(part.lineTotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-sm text-muted-foreground">Estimated total</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(request.totalEstimatedCost)}
                  </span>
                </div>
                {request.approverComments ? (
                  <p className="rounded-2xl bg-slate-50 p-3 text-sm text-muted-foreground">
                    {request.approverComments}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
