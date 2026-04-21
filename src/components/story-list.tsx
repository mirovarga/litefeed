import { StoryCard } from "@/components/story-card"
import type { Order, Sort, Story } from "@/lib/types"

export function StoryList({
  stories,
  activeSort,
  activeOrder,
  startIndex = 0,
}: {
  stories: Story[]
  activeSort: Sort
  activeOrder: Order
  startIndex?: number
}) {
  return (
    <ol className="divide-y">
      {stories.map((s, i) => (
        <li key={`${s.source}-${s.id}`}>
          <StoryCard
            activeOrder={activeOrder}
            activeSort={activeSort}
            index={startIndex + i + 1}
            story={s}
          />
        </li>
      ))}
    </ol>
  )
}
