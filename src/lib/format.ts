import { format } from 'date-fns'

export function formatDate(date: Date) {
  return format(date, 'MMM d, yyyy')
}

export function clampText(s: string, max = 160) {
  const trimmed = s.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}
