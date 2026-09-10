import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { updateTagFormSchema } from './updateTagSchema'
import type { UpdateTagFormValues } from './updateTagSchema'
import { useTagsQuery, useUpdateTag } from '@/queries/tags'
import { useAppStore } from '@/store/appStore'
import { TextField } from '../components/fields/TextField'
import { ColorPickerField } from '../components/fields/ColorPickerField'
import { SwitchField } from '../components/fields/SwitchField'
import { SingleAutocompleteField } from '../components/fields/SingleAutocompleteField'
import { ActionButtons } from '../components/ActionButtons'

const EMPTY_VALUES: UpdateTagFormValues = {
  tagId: '',
  name: '',
  color: '',
  status: false,
}

export function UpdateTagsView() {
  const { isPending: tagsLoading } = useTagsQuery()

  const tags = useAppStore((state) => state.tags)
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
  const selectedTag = tags.find((tag) => tag.id === selectedTagId)
  const updateTag = useUpdateTag()

  const schema = useMemo(
    () =>
      updateTagFormSchema(
        tags.map((t) => t.name),
        selectedTag?.name ?? '',
      ),
    [tags, selectedTag],
  )

  const form = useForm<UpdateTagFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!selectedTag) return
    form.reset({
      tagId: selectedTag.id,
      name: selectedTag.name,
      color: selectedTag.color,
      status: selectedTag.status,
    })
  }, [selectedTag, form])

  const tagOptions = tags.map((t) => ({ id: t.id, label: t.name }))
  const fieldsDisabled = !selectedTag

  const resetToEmpty = () => {
    setSelectedTagId(null)
    form.reset(EMPTY_VALUES)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    await updateTag.mutateAsync({
      id: values.tagId,
      name: values.name,
      color: values.color,
      status: values.status,
    })
    toast.success(`Tag "${values.name}" was updated successfully`)
  })

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-[550px] flex-col items-start gap-6"
    >
      <div className="flex w-full flex-col items-start gap-5">
        <SingleAutocompleteField
          control={form.control}
          name="tagId"
          label="Select a tag"
          options={tagOptions}
          isLoading={tagsLoading}
          onSelect={(id) => setSelectedTagId(id)}
        />
        <TextField
          control={form.control}
          name="name"
          label="Tag Name"
          placeholder="Tag name"
          disabled={fieldsDisabled}
        />
        <ColorPickerField
          control={form.control}
          name="color"
          label="Tag Color"
          disabled={fieldsDisabled}
        />
        <SwitchField
          control={form.control}
          name="status"
          label="Tag Status"
          disabled={fieldsDisabled}
        />
      </div>

      <ActionButtons
        submitLabel="Update Tags"
        onCancel={resetToEmpty}
        isSubmitting={form.formState.isSubmitting}
        disabled={fieldsDisabled}
      />
    </form>
  )
}
