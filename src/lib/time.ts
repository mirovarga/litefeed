const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

export function relativeTime(from: Date, now: Date = new Date()): string {
  const diffSec = Math.round((from.getTime() - now.getTime()) / 1000)
  const abs = Math.abs(diffSec)
  if (abs < 60) {
    return rtf.format(diffSec, "second")
  }
  if (abs < 3600) {
    return rtf.format(Math.round(diffSec / 60), "minute")
  }
  if (abs < 86_400) {
    return rtf.format(Math.round(diffSec / 3600), "hour")
  }
  return rtf.format(Math.round(diffSec / 86_400), "day")
}

export function absoluteTime(date: Date): string {
  return date.toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  })
}
