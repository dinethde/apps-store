import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createTagFormSchema } from './createTagSchema'
import type { CreateTagFormValues } from './createTagSchema'
import { useCreateTag, useTags } from '@/queries/tags'
import { TextField } from '../components/fields/TextField'
import { ColorPickerField } from '../components/fields/ColorPickerField'
import { SwitchField } from '../components/fields/SwitchField'
import { ActionButtons } from '../components/ActionButtons'
import { TagChip } from '../components/TagChip'
import { Typography } from '@/components/ui/typography'

const BLANK_VALUES: CreateTagFormValues = {
  name: '',
  color: '',
  status: false,
}

export function CreateTagsView() {
  const { data: tags = [] } = useTags()
  const createTag = useCreateTag()

  const schema = useMemo(
    () => createTagFormSchema(tags.map((t) => t.name)),
    [tags],
  )

  const form = useForm<CreateTagFormValues>({
    resolver: zodResolver(schema),
    defaultValues: BLANK_VALUES,
    mode: 'onBlur',
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await createTag.mutateAsync(values)
    toast.success(`Tag "${values.name}" was created successfully`)
    form.reset(BLANK_VALUES)
  })

  return (
    <form onSubmit={onSubmit} className="flex w-full items-start gap-6">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
        <div className="flex w-full flex-col items-start gap-5">
          <TextField
            control={form.control}
            name="name"
            label="Tag Name"
            placeholder="Tag name"
          />
          <ColorPickerField
            control={form.control}
            name="color"
            label="Tag Color"
          />
          <SwitchField
            control={form.control}
            name="status"
            label="Tag Status"
          />
        </div>

        <ActionButtons
          submitLabel="Create Tag"
          onCancel={() => form.reset(BLANK_VALUES)}
          isSubmitting={form.formState.isSubmitting}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-3 pt-1">
        <Typography
          variant="p-m-medium"
          className="text-txt-neutral-p2-active underline"
        >
          Existing Tags
        </Typography>
        {tags.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <TagChip key={tag.id} label={tag.name} color={tag.color} />
            ))}
          </div>
        ) : (
          <Typography variant="p-s" className="text-txt-neutral-p3-active">
            No tags created yet
          </Typography>
        )}
      </div>
    </form>
  )
}
