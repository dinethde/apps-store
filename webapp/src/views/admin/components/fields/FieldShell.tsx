import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

type FieldShellProps = {
  htmlFor: string
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}

export function FieldShell({
  htmlFor,
  label,
  error,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn('flex w-full flex-col items-start gap-2', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center justify-center px-0.5"
      >
        <Typography variant="p-m" className="text-txt-neutral-p2-active">
          {label}
        </Typography>
      </label>
      {children}
      {error ? (
        <Typography
          variant="p-s"
          className="px-0.5 text-txt-error-p1-active"
          role="alert"
        >
          {error}
        </Typography>
      ) : null}
    </div>
  )
}
