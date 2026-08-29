import { X } from 'lucide-react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Chip mirrors the `Tag` component set in Figma (node 596:7822). Figma ships
 * six unnamed variants that collapse into three visual treatments, each with
 * its own resting/hover pair:
 *
 * | Figma variant | Chip                                    |
 * | ------------- | --------------------------------------- |
 * | `Variant6`    | `variant="solid"`                       |
 * | `Variant5`    | `variant="solid"` + `onRemove`          |
 * | `Default`     | `variant="outline"`                     |
 * | `Variant2`    | `variant="outline"`, hovered            |
 * | `Variant3`    | `variant="pill"`                        |
 * | `hover`       | `variant="pill"`, hovered               |
 *
 * The hover halves are real `hover:` states rather than separate variants, so
 * a chip transitions on its own instead of needing the caller to track it.
 *
 * Each variant repeats the text colour instead of inheriting it from the base
 * string because `cn`'s twMerge cannot tell the custom `text-p-*` size tokens
 * apart from the `text-txt-*` colour tokens, and drops whichever comes first.
 */
const chipVariants = cva(
  `inline-flex w-fit shrink-0 items-center justify-center gap-1
  whitespace-nowrap`,
  {
    variants: {
      variant: {
        /** Filled neutral chip — the compact default used for tags. */
        solid: `rounded-[4px] bg-surface-neutral-main-hover px-1.5 py-[3px]
        text-p-s-medium text-txt-neutral-p2-active`,
        /** Bordered chip on a subtle surface — used for user group names. */
        outline: `rounded-[4px] border border-outline-neutral-light-active
        bg-surface-neutral-main-active px-2 py-1 text-p-s
        text-txt-neutral-p2-active hover:bg-surface-neutral-main-hover`,
        /** Rounded pill with a secondary outline — used for filter shortcuts. */
        pill: `rounded-[22px] border border-outline-secondary-light-active
        bg-surface-neutral-light-active px-3 py-1 text-p-s-medium
        text-txt-neutral-p2-active hover:border-outline-secondary-light-hover
        hover:bg-transparent`,
      },
    },
    defaultVariants: {
      variant: 'solid',
    },
  },
)

type ChipProps = ComponentProps<'span'> &
  VariantProps<typeof chipVariants> & {
    label: string
    /** Renders the trailing cross; omit it for a plain, static chip. */
    onRemove?: () => void
  }

export function Chip({
  label,
  variant,
  onRemove,
  className,
  ...props
}: ChipProps) {
  return (
    <span
      data-slot="chip"
      className={cn(chipVariants({ variant }), className)}
      {...props}
    >
      {label}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          // The cross is 6px in the design, so the negative margin buys back a
          // usable hit area without changing the chip's measured size.
          className={`-m-1 cursor-pointer rounded-xs p-1 outline-none
            focus-visible:ring-2 focus-visible:ring-ring/50`}
        >
          <X className="size-1.5" strokeWidth={4} />
        </button>
      ) : null}
    </span>
  )
}

export { chipVariants }
