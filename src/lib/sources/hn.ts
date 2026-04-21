import type { Story } from "@/lib/types"

interface HnItem {
  dead?: boolean
  deleted?: boolean
  descendants?: number
  id: number
  score?: number
  time: number
  title?: string
  type?: string
  url?: string
}

const HN_LIMIT = 30

export async function fetchHnNewest(): Promise<Story[]> {
  const idsRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/newstories.json",
    { next: { revalidate: 300 } }
  )
  if (!idsRes.ok) {
    throw new Error(`HN ${idsRes.status} ${idsRes.statusText}`)
  }
  const ids = (await idsRes.json()) as number[]

  const items = await Promise.all(
    ids.slice(0, HN_LIMIT).map(async (id) => {
      const r = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        { next: { revalidate: 300 } }
      )
      if (!r.ok) {
        return null
      }
      return (await r.json()) as HnItem | null
    })
  )

  return items
    .filter(
      (it): it is HnItem =>
        !!it && !it.deleted && !it.dead && it.type === "story" && !!it.title
    )
    .map((it) => {
      const commentsUrl = `https://news.ycombinator.com/item?id=${it.id}`
      return {
        id: String(it.id),
        source: "hn",
        title: it.title ?? "",
        url: it.url || commentsUrl,
        commentsUrl,
        commentCount: it.descendants ?? 0,
        createdAt: new Date(it.time * 1000),
      } satisfies Story
    })
}
