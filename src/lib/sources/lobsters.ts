import type { Story } from "@/lib/types"

interface LobstersStory {
  comment_count: number
  comments_url: string
  created_at: string
  description_plain?: string
  score: number
  short_id: string
  title: string
  url: string
}

export async function fetchLobstersHottest(): Promise<Story[]> {
  const res = await fetch("https://lobste.rs/hottest.json", {
    next: { revalidate: 300 },
    headers: { "user-agent": "litefeed/0.1 (github.com/mirovarga)" },
  })
  if (!res.ok) {
    throw new Error(`Lobsters ${res.status} ${res.statusText}`)
  }
  const data = (await res.json()) as LobstersStory[]
  return data.map((s) => {
    const desc = s.description_plain?.trim() ?? ""
    return {
      id: s.short_id,
      source: "lobsters",
      title: s.title,
      url: s.url || s.comments_url,
      commentsUrl: s.comments_url,
      commentCount: s.comment_count,
      createdAt: new Date(s.created_at),
      summary: desc.length > 0 ? desc : undefined,
    } satisfies Story
  })
}
