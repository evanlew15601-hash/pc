import readingTime from 'reading-time'

export function getReadingTimeMinutes(text: string) {
  const stats = readingTime(text)
  return Math.max(1, Math.round(stats.minutes))
}
