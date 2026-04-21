import { Pagination } from "@/components/pagination"
import { SortFilters } from "@/components/sort-filters"
import { SourceFilters } from "@/components/source-filters"
import { StoryList } from "@/components/story-list"
import { fetchHnNewest } from "@/lib/sources/hn"
import { fetchLobstersNewest } from "@/lib/sources/lobsters"
import { fetchSubredditNewest, SUBREDDITS } from "@/lib/sources/reddit"
import type { Order, Sort, SourceType, Story } from "@/lib/types"

// TODO check what else can be added (images, ...)
// TODO time filters
// TODO generic RSS/Atom/... feeds
// TODO source management (adding, editing, deleting)
// TODO read more link in story card
// TODO design/typography
// TODO saving/starring/...
// TODO mobile friendly design/ux

// TODO client side rendering, but sources are fetched on server side
// TODO fetch hn and lobsters front pages

const PAGE_SIZE = 20

function parseSource(
  value: string | string[] | undefined
): SourceType | undefined {
  if (typeof value === "string" && value.length > 0) {
    return value
  }
  return
}

function parseSort(value: string | string[] | undefined): Sort {
  if (value === "comments") {
    return "comments"
  }
  return "time"
}

function parseOrder(value: string | string[] | undefined): Order {
  if (value === "asc") {
    return "asc"
  }
  return "desc"
}

function parsePage(value: string | string[] | undefined): number {
  if (typeof value !== "string") {
    return 1
  }
  const n = Number.parseInt(value, 10)
  if (!Number.isFinite(n) || n < 1) {
    return 1
  }
  return n
}

export const revalidate = 300

async function settle<T>(
  p: Promise<T>
): Promise<{ data: T } | { error: string }> {
  try {
    return { data: await p }
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
}

async function loadStories(): Promise<{ stories: Story[]; errors: string[] }> {
  const sources = [
    { key: "Lobsters", p: fetchLobstersNewest() },
    { key: "HN", p: fetchHnNewest() },
    ...SUBREDDITS.map((s) => ({
      key: `r/${s}`,
      p: fetchSubredditNewest(s),
    })),
  ]
  const results = await Promise.all(sources.map((s) => settle(s.p)))

  const stories = results.flatMap((r) => ("data" in r ? r.data : []))
  const errors = results
    .map((r, i) => ("error" in r ? `${sources[i].key}: ${r.error}` : null))
    .filter((e): e is string => e !== null)

  stories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return { stories, errors }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    source?: string | string[]
    sort?: string | string[]
    order?: string | string[]
    page?: string | string[]
  }>
}) {
  const { stories, errors } = await loadStories()
  const params = await searchParams
  const source = parseSource(params.source)
  const sort = parseSort(params.sort)
  const order = parseOrder(params.order)
  const requestedPage = parsePage(params.page)

  const visible = stories
    .filter((s) => {
      if (!source) {
        return true
      }
      if (source === "reddit") {
        return s.source.startsWith("r/")
      }
      return s.source === source
    })
    .sort((a, b) => {
      if (sort === "comments") {
        return order === "desc"
          ? (b.commentCount ?? 0) - (a.commentCount ?? 0)
          : (a.commentCount ?? 0) - (b.commentCount ?? 0)
      }
      return order === "desc"
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : a.createdAt.getTime() - b.createdAt.getTime()
    })

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const page = Math.min(requestedPage, totalPages)
  const startIndex = (page - 1) * PAGE_SIZE
  const pageStories = visible.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-5 py-4">
          <SourceFilters
            activeOrder={order}
            activeSort={sort}
            activeSource={source}
          />
          <SortFilters
            activeOrder={order}
            activeSort={sort}
            activeSource={source}
          />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-8">
        {errors.length > 0 ? (
          <div className="mb-6 rounded border border-destructive/50 bg-destructive/5 p-3 text-destructive text-sm">
            {errors.map((e) => (
              <div key={e}>Failed to load {e}</div>
            ))}
          </div>
        ) : null}
        <StoryList
          activeOrder={order}
          activeSort={sort}
          startIndex={startIndex}
          stories={pageStories}
        />
        {totalPages > 1 ? (
          <Pagination
            activeOrder={order}
            activeSort={sort}
            activeSource={source}
            page={page}
            totalPages={totalPages}
          />
        ) : null}
      </main>
    </>
  )
}
