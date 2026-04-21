import Link from "next/link"
import type { Order, Sort } from "@/lib/types"
import { cn } from "@/lib/utils"

const linkClass =
  "inline-flex transition-colors hover:text-foreground hover:underline decoration-muted-foreground/30 underline-offset-4"

export function Pagination({
  page,
  totalPages,
  activeSource,
  activeSort,
  activeOrder,
}: {
  page: number
  totalPages: number
  activeSource?: string
  activeSort: Sort
  activeOrder: Order
}) {
  const getHref = (p: number) => {
    const params = new URLSearchParams()
    if (activeSource) {
      params.set("source", activeSource)
    }
    params.set("sort", activeSort)
    params.set("order", activeOrder)
    if (p > 1) {
      params.set("page", String(p))
    }
    return `/?${params.toString()}`
  }

  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <nav className="mt-8 flex items-center justify-center gap-x-2 text-[13px]">
      {hasPrev ? (
        <Link
          className={cn(linkClass, "text-muted-foreground")}
          href={getHref(page - 1)}
        >
          &lt; Prev
        </Link>
      ) : (
        <span className="inline-flex text-muted-foreground/40">&lt; Prev</span>
      )}
      <span aria-hidden className="text-muted-foreground">
        ·
      </span>
      <span className="font-extrabold text-foreground">
        Page {page} of {totalPages}
      </span>
      <span aria-hidden className="text-muted-foreground">
        ·
      </span>
      {hasNext ? (
        <Link
          className={cn(linkClass, "text-muted-foreground")}
          href={getHref(page + 1)}
        >
          Next &gt;
        </Link>
      ) : (
        <span className="inline-flex text-muted-foreground/40">Next &gt;</span>
      )}
    </nav>
  )
}
