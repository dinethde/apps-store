import { Combobox as ComboboxPrimitive } from '@base-ui/react'
import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
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
  label: string
  options: Array<AutocompleteOption>
  placeholder?: string
  isLoading?: boolean
  disabled?: boolean
  onSelect?: (id: string) => void
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
              <ComboboxPrimitive.Input
                id={name}
                placeholder={placeholder}
                onBlur={field.onBlur}
                aria-invalid={Boolean(fieldState.error)}
                className={cn(
                  'flex h-[33px] w-full items-center overflow-hidden rounded-lg border px-3 py-2 text-p-m outline-none transition-colors',
                  selected
                    ? 'border-user_input-active-border bg-user_input-active-bg text-user_input-active-text'
                    : 'border-user_input-default-border bg-user_input-default-bg text-user_input-default-text',
                  'placeholder:text-user_input-default-text placeholder:text-p-m placeholder:italic hover:border-user_input-hover-border focus-visible:border-user_input-focussed-border focus-visible:ring-3 focus-visible:ring-user_input-focussed-shadow',
                  fieldState.error &&
                  'border-user_input-error-border text-user_input-error-text ring-3 ring-user_input-error-shadow',
                  disabled && 'pointer-events-none opacity-60',
                )}
              />

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
