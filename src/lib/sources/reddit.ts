import type { Story } from "@/lib/types"

export const SUBREDDITS = [
  "czech",
  "vibecoding",
  "haskell",
  "ocaml",
  "functionalprogramming",
  "ClaudeCode",
  "ExperiencedDevs",
  "golang",
  "JetBrains",
  "mcp",
  "rust",
  "selfhosted",
] as const

interface RedditPost {
  created_utc: number
  id: string
  num_comments: number
  permalink: string
  score: number
  selftext?: string
  stickied?: boolean
  title: string
  url: string
}

const REDDIT_LIMIT = 30

export async function fetchSubredditNewest(sub: string): Promise<Story[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${sub}/new.json?limit=${REDDIT_LIMIT}`,
    {
      next: { revalidate: 300 },
      headers: { "user-agent": "litefeed/0.1 (github.com/mirovarga)" },
    }
  )
  if (!res.ok) {
    throw new Error(`Reddit ${res.status} ${res.statusText}`)
  }
  const json = (await res.json()) as {
    data: { children: { data: RedditPost }[] }
  }
  return json.data.children
    .map((c) => c.data)
    .filter((p) => !p.stickied)
    .map((p) => {
      const commentsUrl = `https://www.reddit.com${p.permalink}`
      const selftext = p.selftext?.trim() ?? ""
      return {
        id: p.id,
        source: `r/${sub}`,
        title: p.title,
        url: p.url || commentsUrl,
        commentsUrl,
        commentCount: p.num_comments,
        createdAt: new Date(p.created_utc * 1000),
        summary: selftext.length > 0 ? selftext : undefined,
      } satisfies Story
    })
}
