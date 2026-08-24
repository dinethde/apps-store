import { useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { CloudUpload, TriangleAlert, X } from 'lucide-react'
import { FieldShell } from './FieldShell'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

type FileUploadFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  disabled?: boolean
}

function formatBytes(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function FileUploadField<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
}: FileUploadFieldProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const file = (field.value ?? null) as File | null
        const hasError = Boolean(fieldState.error)

        const handleFiles = (files: FileList | null) => {
          const next = files?.[0]
          if (next) field.onChange(next)
        }

        return (
          <FieldShell htmlFor={name} label={label}>
            <div className="flex w-full flex-col items-start gap-1.5">
              <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    inputRef.current?.click()
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragOver(false)
                  handleFiles(e.dataTransfer.files)
                }}
                aria-invalid={hasError}
                className={cn(
                  `flex w-full cursor-pointer items-center justify-center gap-2
                  overflow-hidden rounded-md border border-dashed
                  border-user_input-default-border bg-user_input-default-bg p-3
                  transition-colors`,
                  isDragOver && 'border-user_input-focussed-border',
                  hasError &&
                    `border-user_input-error-border
                    shadow-[0_0_1px_2px_var(--color-user_input-error-shadow)]`,
                  disabled && 'pointer-events-none opacity-60',
                )}
              >
                {hasError ? (
                  <>
                    <TriangleAlert
                      className={'size-5 shrink-0 text-txt-error-p1-active'}
                    />
                    <Typography
                      variant="p-m"
                      className="text-txt-error-p1-active"
                    >
                      {fieldState.error?.message}
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudUpload
                      className={'size-5 shrink-0 text-user_input-default-text'}
                    />
                    <Typography
                      variant="p-m"
                      className="text-user_input-default-text"
                    >
                      Drag and drop icon or{' '}
                      <span className="underline">Select icon</span>
                    </Typography>
                  </>
                )}
                <input
                  ref={inputRef}
                  id={name}
                  type="file"
                  accept=".svg,image/svg+xml"
                  disabled={disabled}
                  className="sr-only"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {file ? (
                <div
                  className={`flex w-full items-start gap-2 rounded-md border
                    border-user_input-menu-border bg-user_input-menu-bg p-2`}
                >
                  <div
                    className={`size-9 shrink-0 rounded-xs
                      bg-user_input-hover-bg`}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Typography
                      variant="p-m"
                      className="truncate text-user_input-item-text"
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      variant="p-s"
                      className="text-user_input-default-text"
                    >
                      {formatBytes(file.size)}
                    </Typography>
                  </div>
                  <button
                    type="button"
                    onClick={() => field.onChange(null)}
                    aria-label="Remove file"
                    className={`rounded-xs p-1 outline-none hover:opacity-70
                      focus-visible:ring-2 focus-visible:ring-ring/50`}
                  >
                    <X className="size-3 text-user_input-default-text" />
                  </button>
                </div>
              ) : null}

              <div className="flex w-full items-center justify-center px-1">
                <Typography
                  variant="p-s"
                  className="w-full text-user_input-default-text"
                >
                  Only svgs. Max 5mbs
                </Typography>
              </div>
            </div>
          </FieldShell>
        )
      }}
    />
  )
}
