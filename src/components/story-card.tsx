import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { absoluteTime, relativeTime } from "@/lib/time"
import { type Order, type Sort, type Story, sourceLabel } from "@/lib/types"

const WWW_PREFIX = /^www\./

function hostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(WWW_PREFIX, "")
  } catch {
    return null
  }
}

export function StoryCard({
  story,
  activeSort,
  activeOrder,
}: {
  story: Story
  index: number
  activeSort: Sort
  activeOrder: Order
}) {
  const host = hostname(story.url)
  const isSelfPost = story.url === story.commentsUrl

  const params = new URLSearchParams()
  params.set("source", story.source)
  params.set("sort", activeSort)
  params.set("order", activeOrder)
  const sourceHref = `/?${params.toString()}`

  return (
    <article className="group py-4">
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <a
            className="font-medium text-[16px] text-foreground leading-snug tracking-tight decoration-muted-foreground/40 underline-offset-4 visited:text-muted-foreground group-hover:underline"
            href={story.url}
            rel="noreferrer"
            target="_blank"
          >
            {story.title}
          </a>
          {host && !isSelfPost ? (
            <span className="text-[14px] text-muted-foreground/80">
              ({host})
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 text-[12px] text-muted-foreground">
          <span title={absoluteTime(story.createdAt)}>
            {relativeTime(story.createdAt)}
          </span>
          <span aria-hidden>·</span>
          <a
            className="hover:text-foreground hover:underline"
            href={story.commentsUrl}
            rel="noreferrer"
            target="_blank"
          >
            {story.commentCount == null
              ? "comments"
              : `${story.commentCount} comments`}
          </a>
          <span aria-hidden>·</span>
          <Badge render={<Link href={sourceHref} />} variant="secondary">
            {sourceLabel(story.source)}
          </Badge>
        </div>
        {story.summary ? (
          <p className="line-clamp-5 text-[13px] text-muted-foreground leading-relaxed">
            {story.summary}
          </p>
        ) : null}
      </div>
    </article>
  )
}
