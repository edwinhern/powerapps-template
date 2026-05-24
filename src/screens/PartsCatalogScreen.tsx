import { Minus, Package, Plus, Search, ShoppingCart } from "lucide-react"
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { filterParts } from "@/features/parts/catalog"
import { useCartStore } from "@/features/parts/cart-store"
import { mockParts } from "@/features/parts/mock-parts"
import type { ReplacementPart } from "@/features/parts/types"
import { formatCurrency } from "@/lib/format"

const ALL_CATEGORIES = "All Categories"

export function PartsCatalogScreen() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState<string>(ALL_CATEGORIES)
  const addItem = useCartStore((state) => state.addItem)

  const categories = useMemo(() => {
    const unique = Array.from(new Set(mockParts.map((part) => part.category)))
    return [ALL_CATEGORIES, ...unique.sort()]
  }, [])

  const filteredParts = useMemo(() => {
    const searched = filterParts(mockParts, searchTerm)
    if (category === ALL_CATEGORIES) {
      return searched
    }
    return searched.filter((part) => part.category === category)
  }, [searchTerm, category])

  return (
    <section className="space-y-6 px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Replacement parts
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Search the catalog and add what the job needs.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            id="parts-search"
            aria-label="Search parts"
            className="bg-card h-11 rounded-lg pl-10"
            placeholder="Search parts, numbers, or categories..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger
            aria-label="Filter by category"
            className="bg-card !h-11 rounded-lg px-4 sm:w-56"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredParts.length === 0 ? (
        <div className="bg-card rounded-2xl border border-dashed px-6 py-12 text-center">
          <p className="text-lg font-semibold">No parts match your search</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Try a different keyword or clear the category filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredParts.map((part) => (
            <PartCard
              key={part.id}
              part={part}
              onAdd={(quantity) => addItem(part, quantity)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

type PartCardProps = {
  part: ReplacementPart
  onAdd: (quantity: number) => void
}

function PartCard({ part, onAdd }: PartCardProps) {
  const [quantity, setQuantity] = useState(1)
  const isAvailable = part.availability === "Available"

  function handleAdd() {
    onAdd(quantity)
    setQuantity(1)
  }

  return (
    <article className="bg-card border-border/60 group flex flex-col rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        <div className="bg-accent text-brand grid size-20 shrink-0 place-items-center rounded-lg">
          <Package className="size-8" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base leading-tight font-semibold">
              {part.title}
            </h2>
            <AvailabilityBadge availability={part.availability} />
          </div>
          <p className="text-muted-foreground mt-1 font-mono text-xs">
            {part.partNumber}
          </p>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
            {part.description}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Badge variant="outline" className="rounded-md">
              {part.category}
            </Badge>
            <span className="text-base font-semibold">
              {formatCurrency(part.unitCost)}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-border/60 my-4" />

      <div className="flex items-center justify-between gap-3">
        {isAvailable ? (
          <>
            <div className="bg-muted inline-flex items-center gap-1 rounded-lg p-1">
              <button
                type="button"
                aria-label={`Decrease ${part.title} quantity`}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="hover:bg-background grid size-7 place-items-center rounded-md transition-colors"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase ${part.title} quantity`}
                onClick={() => setQuantity((q) => q + 1)}
                className="hover:bg-background grid size-7 place-items-center rounded-md transition-colors"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              size="field"
              aria-label={`Add ${part.title}`}
              onClick={handleAdd}
              className="flex-1"
            >
              <ShoppingCart className="size-4" />
              Add to Cart
            </Button>
          </>
        ) : (
          <Button
            size="field"
            variant="secondary"
            disabled
            aria-label="Out of stock"
            className="w-full"
          >
            Out of stock
          </Button>
        )}
      </div>
    </article>
  )
}

function AvailabilityBadge({
  availability,
}: {
  availability: ReplacementPart["availability"]
}) {
  if (availability === "Available") {
    return (
      <span className="bg-success/10 text-success inline-flex items-center gap-1.5 rounded-md border border-transparent px-2 py-0.5 text-xs font-medium">
        <span className="bg-success size-1.5 rounded-full" />
        Available
      </span>
    )
  }
  return (
    <span className="bg-destructive/10 text-destructive inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium">
      <span className="bg-destructive size-1.5 rounded-full" />
      Out of Stock
    </span>
  )
}
