import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Pipette } from 'lucide-react'
import { FieldShell } from './FieldShell'
import { cn } from '@/lib/utils'

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> }
  }
}

type ColorPickerFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  disabled?: boolean
}

export function ColorPickerField<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
}: ColorPickerFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasEyeDropper =
          typeof window !== 'undefined' && 'EyeDropper' in window

        const pickColor = async () => {
          if (!hasEyeDropper || !window.EyeDropper) return
          try {
            const dropper = new window.EyeDropper()
            const result = await dropper.open()
            field.onChange(result.sRGBHex.toUpperCase())
          } catch {
            // user cancelled the pick - no-op
          }
        }

        return (
          <FieldShell
            htmlFor={name}
            label={label}
            error={fieldState.error?.message}
          >
            <div
              className={cn(
                'flex h-11 w-full items-center gap-2.5 rounded-lg border border-user_input-active-border px-2.5 py-2 transition-colors',
                'has-[input:focus-visible]:border-outline-secondary-main-active has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-user_input-focussed-shadow',
                fieldState.error &&
                'border-user_input-error-border ring-3 ring-user_input-error-shadow',
                disabled && 'pointer-events-none opacity-60',
              )}
            >
              <button
                type="button"
                onClick={pickColor}
                disabled={!hasEyeDropper || disabled}
                aria-label="Pick color from screen"
                className="flex shrink-0 items-center justify-center rounded-md bg-secondary-100 p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Pipette className="size-4 text-secondary-main" />
              </button>
              <input
                id={name}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                onBlur={field.onBlur}
                disabled={disabled}
                placeholder="#FFFFFF"
                aria-invalid={Boolean(fieldState.error)}
                className="w-full bg-transparent text-p-m text-txt-neutral-p2-active outline-none placeholder:text-txt-neutral-p3-active"
              />
            </div>
          </FieldShell>
        )
      }}
    />
  )
}
