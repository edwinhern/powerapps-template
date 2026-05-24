import { Search, ShoppingCart } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { filterParts } from "@/features/parts/catalog"
import type { ReplacementPart } from "@/features/parts/types"
import { formatCurrency } from "@/lib/format"

type PartsCatalogScreenProps = {
  parts: ReplacementPart[]
  cartCount: number
  onAddPart: (part: ReplacementPart) => void
}

export function PartsCatalogScreen({
  parts,
  cartCount,
  onAddPart,
}: PartsCatalogScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredParts = filterParts(parts, searchTerm)

  return (
    <section className="space-y-5 pb-28">
      <div className="rounded-b-[2rem] bg-slate-950 px-5 pb-6 pt-8 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cyan-200">Field parts desk</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Replacement parts</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Search the crew catalog, confirm stock, and add what the job needs.
            </p>
          </div>
          <Badge className="gap-1 rounded-full bg-cyan-400 px-3 py-1 text-slate-950 hover:bg-cyan-400">
            <ShoppingCart className="size-3.5" />
            {cartCount}
          </Badge>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <label className="text-sm font-medium" htmlFor="parts-search">
          Search parts
        </label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="parts-search"
            aria-label="Search parts"
            className="h-12 rounded-2xl pl-10 text-base"
            placeholder="Name, part number, or category"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {filteredParts.map((part) => {
          const isAvailable = part.availability === "Available"

          return (
            <Card key={part.id} className="overflow-hidden border-slate-200/80 py-0 shadow-md">
              <CardHeader className="gap-3 bg-slate-50 px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl leading-tight">{part.title}</CardTitle>
                    <CardDescription className="mt-1 font-mono text-sm">
                      {part.partNumber}
                    </CardDescription>
                  </div>
                  <Badge variant={isAvailable ? "default" : "secondary"}>
                    {part.availability}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-5 py-5">
                <p className="text-sm text-muted-foreground">{part.description}</p>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                    {part.category}
                  </span>
                  <span className="text-lg font-semibold">{formatCurrency(part.unitCost)}</span>
                </div>
                <Button
                  className="h-12 w-full rounded-2xl text-base"
                  disabled={!isAvailable}
                  onClick={() => onAddPart(part)}
                >
                  {isAvailable ? `Add ${part.title}` : "Out of stock"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
