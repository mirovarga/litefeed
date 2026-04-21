import Link from "next/link"
import type { Order, Sort } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SortOption {
  key: Sort
  label: string
}

const OPTIONS: SortOption[] = [
  { key: "time", label: "Time" },
  { key: "comments", label: "# Comments" },
]

export function SortFilters({
  activeSort,
  activeOrder,
  activeSource,
}: {
  activeSort: Sort
  activeOrder: Order
  activeSource?: string
}) {
  const getHref = (sort: Sort, order: Order) => {
    const params = new URLSearchParams()
    if (activeSource) {
      params.set("source", activeSource)
    }
    params.set("sort", sort)
    params.set("order", order)
    return `/?${params.toString()}`
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
      {OPTIONS.map((opt, i) => {
        const isSelected = activeSort === opt.key
        const nextOrder: Order =
          isSelected && activeOrder === "desc" ? "asc" : "desc"

        return (
          <span className="inline-flex items-center gap-x-2" key={opt.key}>
            {i > 0 && (
              <span aria-hidden className="text-muted-foreground">
                ·
              </span>
            )}
            <Link
              className={cn(
                "inline-flex items-center gap-1 decoration-muted-foreground/30 underline-offset-4 transition-colors hover:text-foreground hover:underline",
                isSelected
                  ? "font-extrabold text-foreground"
                  : "text-muted-foreground"
              )}
              href={getHref(opt.key, nextOrder)}
            >
              {opt.label}
              {isSelected && (
                <span className="text-[12px] opacity-70">
                  {activeOrder === "desc" ? "↓" : "↑"}
                </span>
              )}
            </Link>
          </span>
        )
      })}
    </div>
  )
}
