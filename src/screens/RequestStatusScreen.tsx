import { CheckCircle2, ClipboardList, Clock3, XCircle } from "lucide-react"

import { EmptyState } from "@/components/empty-state"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequests } from "@/features/parts/cart-store"
import type { RequestStatus } from "@/features/requests/types"
import { formatCurrency } from "@/lib/format"

function statusVariant(
  status: RequestStatus,
): "success" | "warning" | "destructive" {
  if (status === "Approved") return "success"
  if (status === "Rejected") return "destructive"
  return "warning"
}

function StatusIcon({ status }: { status: RequestStatus }) {
  if (status === "Approved") return <CheckCircle2 className="size-4" />
  if (status === "Rejected") return <XCircle className="size-4" />
  return <Clock3 className="size-4" />
}

export function RequestStatusScreen() {
  const requests = useRequests()

  return (
    <section className="space-y-5 px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
      <div>
        <p className="text-muted-foreground text-sm font-medium">
          Submitted requests
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Request status
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Track pending approvals and read approver comments when they are
          added.
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<ClipboardList />}
          title="No submitted requests yet"
          description="Submitted carts appear here as read-only requests."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="gap-3 py-0">
              <CardHeader className="px-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{request.id}</CardTitle>
                    <CardDescription>
                      Submitted by {request.requestorName}
                    </CardDescription>
                  </div>
                  <Badge variant={statusVariant(request.status)} className="gap-1">
                    <StatusIcon status={request.status} />
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-5 pb-5">
                <ul className="space-y-2">
                  {request.requestedParts.map((part) => (
                    <li
                      key={`${request.id}-${part.partNumber}`}
                      className="bg-muted flex items-start justify-between gap-3 rounded-lg p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">
                          {part.partName} x {part.quantity}
                        </p>
                        <p className="text-muted-foreground font-mono">
                          {part.partNumber}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(part.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-border/60 flex items-center justify-between border-t pt-4">
                  <span className="text-muted-foreground text-sm">
                    Estimated total
                  </span>
                  <span className="text-xl font-bold">
                    {formatCurrency(request.totalEstimatedCost)}
                  </span>
                </div>
                {request.approverComments ? (
                  <p className="bg-muted text-muted-foreground rounded-lg p-3 text-sm">
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
