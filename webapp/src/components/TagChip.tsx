import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type TagChipProps = {
  label: string
  color: string
  onRemove?: () => void
  className?: string
}

/**
 * Tag colors are user-defined data (picked per-tag via the color picker), not
 * part of the static design-token palette, so they're applied as inline
 * color-mix() tints rather than token classes.
 */
export function TagChip({ label, color, onRemove, className }: TagChipProps) {
  return (
    <span
      className={cn(
        `inline-flex shrink-0 items-center gap-1.5 rounded-[4px] border px-1.5
        py-[3px] text-p-s-medium`,
        className,
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 8%, white)`,
        borderColor: `color-mix(in srgb, ${color} 45%, white)`,
        color: `color-mix(in srgb, ${color} 85%, black)`,
      }}
    >
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className={`rounded-xs opacity-70 outline-none hover:opacity-100
            focus-visible:ring-2 focus-visible:ring-ring/50`}
        >
          <X className="size-3" />
        </button>
      ) : null}
    </span>
  )
}
