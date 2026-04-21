export type SourceType = string

export function sourceLabel(s: SourceType): string {
  if (s === "hn") {
    return "HN"
  }
  if (s === "lobsters") {
    return "Lobsters"
  }
  return s
}

export type Sort = "time" | "comments"
export type Order = "asc" | "desc"

export interface Story {
  commentCount: number
  commentsUrl: string
  createdAt: Date
  id: string
  source: SourceType
  summary?: string
  title: string
  url: string
}
