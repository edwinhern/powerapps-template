import type { ReplacementPart } from "./types"

export function filterParts(parts: ReplacementPart[], searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  if (!normalizedSearch) {
    return parts
  }

  return parts.filter((part) =>
    [part.title, part.partNumber, part.category].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  )
}
