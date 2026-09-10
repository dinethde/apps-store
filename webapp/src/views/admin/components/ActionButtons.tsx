import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ActionButtonsProps = {
  submitLabel: string
  onCancel: () => void
  isSubmitting?: boolean
  disabled?: boolean
  className?: string
}

export function ActionButtons({
  submitLabel,
  onCancel,
  isSubmitting,
  disabled,
  className,
}: ActionButtonsProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Button
        type="submit"
        disabled={disabled || isSubmitting}
        className={`h-auto rounded-md bg-btn-primary-filled-default-bg px-5 py-2
          text-p-m-medium text-btn-primary-filled-default-text
          hover:bg-btn-primary-filled-hover-bg
          active:bg-btn-primary-filled-active-bg`}
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className={`h-auto rounded-md border-btn-neutral-filled-default-border
          bg-btn-neutral-filled-default-bg px-5 py-2 text-p-m-medium
          text-btn-neutral-filled-default-text
          hover:bg-btn-neutral-filled-hover-bg
          hover:text-btn-neutral-filled-hover-text`}
      >
        Cancel
      </Button>
    </div>
  )
}
