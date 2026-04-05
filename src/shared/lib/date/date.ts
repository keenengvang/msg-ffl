import { format, formatDistanceToNowStrict } from 'date-fns'

export function formatDate(ms: number): string {
  return format(new Date(ms), 'MMM d, yyyy')
}

export function formatTimeAgo(ms: number): string {
  return formatDistanceToNowStrict(new Date(ms), { addSuffix: true })
}
