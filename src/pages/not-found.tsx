import { Compass } from "lucide-react"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 py-16">
      <EmptyState
        icon={<Compass />}
        title="404 — page not found"
        description="This isn't the page you're looking for. Head back to the catalog to keep working."
        action={
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        }
        className="w-full max-w-md"
      />
    </div>
  )
}
