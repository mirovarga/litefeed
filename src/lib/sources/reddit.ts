import { XMLParser } from "fast-xml-parser"
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

interface AtomEntry {
  author: { name: string }
  content: string | { "#text": string }
  id: string
  link: { "@_href": string }
  published: string
  title: string
}

function contentText(content: AtomEntry["content"]): string {
  return typeof content === "string" ? content : (content["#text"] ?? "")
}

interface AtomFeed {
  feed: { entry: AtomEntry | AtomEntry[] }
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
})

const LINK_RE = /href="([^"]+)">\[link\]/
const MD_RE = /<div class="md">([\s\S]*?)<\/div>/
const T3_RE = /^t3_/

function extractArticleUrl(content: string, fallback: string): string {
  const match = content.match(LINK_RE)
  return match ? match[1] : fallback
}

function extractSummary(content: string): string | undefined {
  const mdMatch = content.match(MD_RE)
  if (!mdMatch) {
    return
  }
  const text = mdMatch[1]
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > 0 ? text : undefined
}

export async function fetchSubredditHot(sub: string): Promise<Story[]> {
  const res = await fetch(`https://www.reddit.com/r/${sub}/hot.rss`, {
    next: { revalidate: 300 },
    headers: { "user-agent": "litefeed/0.1 (github.com/mirovarga)" },
  })
  if (!res.ok) {
    throw new Error(`Reddit ${res.status} ${res.statusText}`)
  }
  const text = await res.text()
  const data = parser.parse(text) as AtomFeed
  const raw = data.feed.entry
  let entries: AtomEntry[]
  if (Array.isArray(raw)) {
    entries = raw
  } else if (raw) {
    entries = [raw]
  } else {
    entries = []
  }
  return entries
    .filter((e) => e.author.name !== "/u/AutoModerator")
    .map((e) => {
      const commentsUrl = e.link["@_href"]
      const content = contentText(e.content)
      const url = extractArticleUrl(content, commentsUrl)
      return {
        id: e.id.replace(T3_RE, ""),
        source: `r/${sub}`,
        title: e.title,
        url,
        commentsUrl,
        createdAt: new Date(e.published),
        summary: extractSummary(content),
      } satisfies Story
    })
}
