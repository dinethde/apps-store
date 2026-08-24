import { Combobox as ComboboxPrimitive } from '@base-ui/react'
import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import type { ReactNode } from 'react'
import { FieldShell } from './FieldShell'
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export type AutocompleteOption = { id: string; label: string }

type SingleAutocompleteFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  options: Array<AutocompleteOption>
  placeholder?: string
  isLoading?: boolean
  disabled?: boolean
  onSelect?: (id: string) => void
  startIcon?: ReactNode
}

export function SingleAutocompleteField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = 'Placeholder',
  isLoading,
  disabled,
  onSelect,
  startIcon,
}: SingleAutocompleteFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selected = options.find((o) => o.id === field.value) ?? null

        return (
          <FieldShell
            htmlFor={name}
            label={label}
            error={fieldState.error?.message}
          >
            <ComboboxPrimitive.Root<AutocompleteOption>
              items={options}
              value={selected}
              isItemEqualToValue={(a, b) => a.id === b.id}
              itemToStringLabel={(o) => o.label}
              onValueChange={(option) => {
                field.onChange(option?.id ?? '')
                if (option) onSelect?.(option.id)
              }}
              disabled={disabled}
            >
              <div className="relative w-full">
                {startIcon ? (
                  <span
                    className={`pointer-events-none absolute top-1/2 left-3
                      -translate-y-1/2 text-user_input-default-text
                      [&_svg]:size-4`}
                  >
                    {startIcon}
                  </span>
                ) : null}

                <ComboboxPrimitive.Input
                  id={name}
                  placeholder={placeholder}
                  aria-label={label ?? placeholder}
                  onBlur={field.onBlur}
                  aria-invalid={Boolean(fieldState.error)}
                  className={cn(
                    `flex h-[33px] w-full items-center overflow-hidden
                    rounded-lg border px-3 py-2 text-p-m transition-colors
                    outline-none`,
                    startIcon && 'pl-9',
                    selected
                      ? `border-user_input-active-border bg-user_input-active-bg
                        text-user_input-active-text`
                      : `border-user_input-default-border
                        bg-user_input-default-bg text-user_input-default-text`,
                    `placeholder:text-p-m
                    placeholder:text-user_input-default-text
                    hover:border-user_input-hover-border
                    focus-visible:border-user_input-focussed-border
                    focus-visible:ring-3
                    focus-visible:ring-user_input-focussed-shadow`,
                    fieldState.error &&
                      `border-user_input-error-border text-user_input-error-text
                      ring-3 ring-user_input-error-shadow`,
                    disabled && 'pointer-events-none opacity-60',
                  )}
                />
              </div>

              <ComboboxContent className="border-user_input-menu-border p-0">
                <ComboboxList>
                  {isLoading ? (
                    <div className="px-2 py-3">
                      <Typography
                        variant="p-s"
                        className="text-user_input-default-text"
                      >
                        Loading…
                      </Typography>
                    </div>
                  ) : (
                    (item: AutocompleteOption) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )
                  )}
                </ComboboxList>
                <ComboboxEmpty>No results found</ComboboxEmpty>
              </ComboboxContent>
            </ComboboxPrimitive.Root>
          </FieldShell>
        )
      }}
    />
  )
}
