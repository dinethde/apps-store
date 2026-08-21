import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { FieldShell } from './FieldShell'

type TextareaFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  disabled?: boolean
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
}: TextareaFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldShell
          htmlFor={name}
          label={label}
          error={fieldState.error?.message}
        >
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={Boolean(fieldState.error)}
            aria-describedby={fieldState.error ? `${name}-error` : undefined}
            className="h-[100px] min-h-[100px] resize-none rounded-lg border-user_input-default-border bg-user_input-default-bg px-2.5 py-2 text-p-m text-txt-primary-p2-active placeholder:text-user_input-default-text hover:border-user_input-hover-border focus-visible:border-user_input-focussed-border focus-visible:ring-3 focus-visible:ring-user_input-focussed-shadow aria-invalid:border-user_input-error-border aria-invalid:ring-3 aria-invalid:ring-user_input-error-shadow"
          />
        </FieldShell>
      )}
    />
  )
}
