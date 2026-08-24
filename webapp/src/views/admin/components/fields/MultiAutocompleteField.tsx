import { Combobox as ComboboxPrimitive } from '@base-ui/react'
import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { X } from 'lucide-react'
import { FieldShell } from './FieldShell'
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { cn } from '@/lib/utils'

export type AutocompleteOption = { id: string; label: string; color?: string }

type MultiAutocompleteFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  options: Array<AutocompleteOption>
  placeholder?: string
  disabled?: boolean
}

export function MultiAutocompleteField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = 'Placeholder',
  disabled,
}: MultiAutocompleteFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedIds: Array<string> = field.value ?? []
        const selected = selectedIds
          .map((id) => options.find((o) => o.id === id))
          .filter((o): o is AutocompleteOption => Boolean(o))

        return (
          <FieldShell
            htmlFor={name}
            label={label}
            error={fieldState.error?.message}
          >
            <ComboboxPrimitive.Root<AutocompleteOption, true>
              items={options}
              multiple
              value={selected}
              isItemEqualToValue={(a, b) => a.id === b.id}
              itemToStringLabel={(o) => o.label}
              onValueChange={(next) => field.onChange(next.map((o) => o.id))}
              disabled={disabled}
            >
              <ComboboxPrimitive.Chips
                className={cn(
                  'flex min-h-[33px] w-full flex-wrap items-center gap-2 overflow-hidden rounded-lg border px-1.5 py-2 transition-colors',
                  selected.length
                    ? 'border-user_input-active-border bg-user_input-active-bg'
                    : 'border-user_input-default-border bg-user_input-default-bg',
                  'has-[input:focus-visible]:border-user_input-focussed-border has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-user_input-focussed-shadow',
                  fieldState.error &&
                  'border-user_input-error-border ring-3 ring-user_input-error-shadow',
                  disabled && 'pointer-events-none opacity-60',
                )}
              >
                {selected.map((option) =>
                  option.color ? (
                    <ComboboxPrimitive.Chip
                      key={option.id}
                      className="flex shrink-0 items-center gap-1.5 rounded-[4px] border px-1.5 py-[3px] text-p-s-medium"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${option.color} 8%, white)`,
                        borderColor: `color-mix(in srgb, ${option.color} 45%, white)`,
                        color: `color-mix(in srgb, ${option.color} 85%, black)`,
                      }}
                    >
                      {option.label}
                      <ComboboxPrimitive.ChipRemove
                        aria-label={`Remove ${option.label}`}
                        className="rounded-xs opacity-70 outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        <X className="size-2.5" />
                      </ComboboxPrimitive.ChipRemove>
                    </ComboboxPrimitive.Chip>
                  ) : (
                    <ComboboxPrimitive.Chip
                      key={option.id}
                      className="flex shrink-0 items-center gap-1 rounded-[4px] bg-surface-neutral-main-hover px-1.5 py-[3px] text-p-s-medium text-txt-neutral-p2-active" >
                      {option.label}
                      <ComboboxPrimitive.ChipRemove
                        aria-label={`Remove ${option.label}`}
                        className="rounded-xs opacity-70 outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        <X className="size-2.5" />
                      </ComboboxPrimitive.ChipRemove>
                    </ComboboxPrimitive.Chip>
                  ),
                )}
                <ComboboxPrimitive.Input
                  id={name}
                  onBlur={field.onBlur}
                  placeholder={selected.length ? '' : placeholder}
                  aria-invalid={Boolean(fieldState.error)}
                  className="min-w-16 flex-1 bg-transparent text-p-m text-user_input-active-text outline-none placeholder:text-user_input-default-text"
                />
              </ComboboxPrimitive.Chips>

              <ComboboxContent className="border-user_input-menu-border p-0">
                <ComboboxList>
                  {(item: AutocompleteOption) => (
                    <ComboboxItem key={item.id} value={item}>
                      {item.label}
                    </ComboboxItem>
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
