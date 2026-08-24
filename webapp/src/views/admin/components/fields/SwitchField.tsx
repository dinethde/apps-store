import { Controller } from 'react-hook-form'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import { Typography } from '@/components/ui/typography'

type SwitchFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label: string
  disabled?: boolean
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
}: SwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex w-full flex-col items-start gap-3">
          <label
            htmlFor={name}
            className="flex items-center justify-center px-0.5"
          >
            <Typography variant="p-m" className="text-txt-neutral-p2-active">
              {label}
            </Typography>
          </label>
          <label
            htmlFor={name}
            className="flex cursor-pointer items-center gap-2.5"
          >
            <Switch
              id={name}
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => field.onChange(checked)}
              disabled={disabled}
              className={`h-[17px] w-[34px]
              data-checked:bg-fill-success-main-active
              data-unchecked:bg-fill-neutral-main-active
              [&_[data-slot=switch-thumb]]:size-[15px]
              [&_[data-slot=switch-thumb]]:data-checked:translate-x-[17px]`}
            />
            <Typography variant="p-m" className="text-txt-neutral-p3-active">
              {field.value ? 'Active' : 'Inactive'}
            </Typography>
          </label>
        </div>
      )}
    />
  )
}
