import { ChevronDown } from "lucide-react"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SUBREDDITS } from "@/lib/sources/reddit"
import {
  type Order,
  type Sort,
  type SourceType,
  sourceLabel,
} from "@/lib/types"
import { cn } from "@/lib/utils"

const TOP_SOURCES: SourceType[] = ["lobsters", "hn"]

const linkClass =
  "inline-flex transition-colors hover:text-foreground hover:underline decoration-muted-foreground/30 underline-offset-4"

export function SourceFilters({
  activeSource,
  activeSort,
  activeOrder,
}: {
  activeSource?: string
  activeSort: Sort
  activeOrder: Order
}) {
  const getHref = (source?: string) => {
    const params = new URLSearchParams()
    if (source) {
      params.set("source", source)
    }
    params.set("sort", activeSort)
    params.set("order", activeOrder)
    return `/?${params.toString()}`
  }

  const redditActive =
    activeSource === "reddit" || activeSource?.startsWith("r/")

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
      <Link
        className={cn(
          linkClass,
          activeSource
            ? "text-muted-foreground"
            : "font-extrabold text-foreground"
        )}
        href={getHref()}
      >
        All
      </Link>
      {TOP_SOURCES.map((s) => (
        <span className="inline-flex items-center gap-x-2" key={s}>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <Link
            className={cn(
              linkClass,
              activeSource === s
                ? "font-extrabold text-foreground"
                : "text-muted-foreground"
            )}
            href={getHref(s)}
          >
            {sourceLabel(s)}
          </Link>
        </span>
      ))}
      <span className="inline-flex items-center gap-x-2">
        <span aria-hidden className="text-muted-foreground">
          ·
        </span>
        <span className="inline-flex items-center gap-0.5">
          <Link
            className={cn(
              linkClass,
              redditActive
                ? "font-extrabold text-foreground"
                : "text-muted-foreground"
            )}
            href={getHref("reddit")}
          >
            Reddit
          </Link>
          <Popover>
            <PopoverTrigger
              aria-label="Choose subreddit"
              className={cn(
                "inline-flex cursor-pointer items-center transition-colors hover:text-foreground",
                redditActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <ChevronDown className="opacity-70" size={14} />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-max border bg-background p-2 shadow-lg"
              sideOffset={6}
            >
              <ul className="flex flex-col gap-1 text-[13px]">
                {SUBREDDITS.map((s) => {
                  const src = `r/${s}`
                  return (
                    <li key={s}>
                      <Link
                        className={cn(
                          linkClass,
                          activeSource === src
                            ? "font-extrabold text-foreground"
                            : "text-muted-foreground"
                        )}
                        href={getHref(src)}
                      >
                        {sourceLabel(src)}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </PopoverContent>
          </Popover>
        </span>
      </span>
    </div>
  )
}
