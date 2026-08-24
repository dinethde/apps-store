import { Fragment } from 'react'
import { cn } from '@/lib/utils'

type HighlightTextProps = {
  text: string
  query: string
  className?: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Renders `text` as-is, but wraps every substring that matches `query`
 * (case-insensitive) in a <mark> so only the matched portion is highlighted.
 */
export function HighlightText({ text, query, className }: HighlightTextProps) {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) return <>{text}</>

  const pattern = new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'gi')
  const parts = text.split(pattern)

  if (parts.length === 1) return <>{text}</>

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === trimmedQuery.toLowerCase() ? (
          <mark
            key={index}
            className={cn(
              'rounded-[2px] bg-surface-brand-main-active text-txt-brand-p1-active',
              className,
            )}
          >
            {part}
          </mark>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
}
