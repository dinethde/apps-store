import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FieldShell } from './FieldShell'

type TextFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  disabled?: boolean
  type?: string
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  type = 'text',
}: TextFieldProps<T>) {
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
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={Boolean(fieldState.error)}
            aria-describedby={fieldState.error ? `${name}-error` : undefined}
            className="h-[33px] rounded-lg border-user_input-default-border bg-user_input-default-bg px-2.5 py-2 text-p-m text-txt-primary-p2-active placeholder:text-user_input-default-text hover:border-user_input-hover-border focus-visible:border-user_input-focussed-border focus-visible:ring-3 focus-visible:ring-user_input-focussed-shadow aria-invalid:border-user_input-error-border aria-invalid:ring-3 aria-invalid:ring-user_input-error-shadow"
          />
        </FieldShell>
      )}
    />
  )
}
