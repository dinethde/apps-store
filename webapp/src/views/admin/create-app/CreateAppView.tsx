import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createAppFormSchema } from './createAppSchema'
import type { CreateAppFormValues } from './createAppSchema'
import {
  useApps,
  useCreateApp,
  useTags,
  useUserGroups,
} from '@/hooks/useAdminQueries'
import { TextField } from '../components/fields/TextField'
import { TextareaField } from '../components/fields/TextareaField'
import { MultiAutocompleteField } from '../components/fields/MultiAutocompleteField'
import { FileUploadField } from '../components/fields/FileUploadField'
import { SwitchField } from '../components/fields/SwitchField'
import { ActionButtons } from '../components/ActionButtons'

const BLANK_VALUES: CreateAppFormValues = {
  name: '',
  url: '',
  version: '',
  description: '',
  tagline: '',
  tagIds: [],
  userGroupIds: [],
  icon: null,
  status: false,
}

export function CreateAppView() {
  const { data: apps = [] } = useApps()
  const { data: tags = [] } = useTags()
  const { data: userGroups = [] } = useUserGroups()
  const createApp = useCreateApp()

  const schema = useMemo(
    () => createAppFormSchema(apps.map((a) => a.name)),
    [apps],
  )

  const form = useForm<CreateAppFormValues>({
    resolver: zodResolver(schema),
    defaultValues: BLANK_VALUES,
    mode: 'onBlur',
  })

  const tagOptions = tags.map((t) => ({
    id: t.id,
    label: t.name,
    color: t.color,
  }))
  const userGroupOptions = userGroups.map((g) => ({ id: g.id, label: g.name }))

  const onSubmit = form.handleSubmit(async (values) => {
    await createApp.mutateAsync({
      name: values.name,
      url: values.url,
      version: values.version,
      description: values.description,
      tagline: values.tagline ?? '',
      tagIds: values.tagIds,
      userGroupIds: values.userGroupIds,
      icon: values.icon
        ? {
            name: values.icon.name,
            sizeLabel: `${(values.icon.size / 1024).toFixed(1)} KB`,
            url: '',
          }
        : null,
      status: values.status,
    })
    toast.success(`"${values.name}" was created successfully`)
    form.reset(BLANK_VALUES)
  })

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col items-start gap-5"
    >
      <div className="flex w-full items-start gap-5">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
          <TextField
            control={form.control}
            name="name"
            label="App Name"
            placeholder="placeholder"
          />
          <TextField
            control={form.control}
            name="url"
            label="App URL"
            placeholder="placeholder"
          />
          <TextField
            control={form.control}
            name="version"
            label="App Version"
            placeholder="placeholder"
          />
          <TextareaField
            control={form.control}
            name="description"
            label="App Description"
            placeholder="placeholder"
          />
          <MultiAutocompleteField
            control={form.control}
            name="tagIds"
            label="Tags"
            options={tagOptions}
            placeholder="Placeholder"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start justify-between gap-5 self-stretch">
          <div className="flex w-full flex-col items-start gap-5">
            <TextField
              control={form.control}
              name="tagline"
              label="Tagline"
              placeholder="placeholder"
            />
            <MultiAutocompleteField
              control={form.control}
              name="userGroupIds"
              label="User Groups"
              options={userGroupOptions}
              placeholder="Placeholder"
            />
            <FileUploadField
              control={form.control}
              name="icon"
              label="App Icon"
            />
            <SwitchField
              control={form.control}
              name="status"
              label="App Status"
            />
          </div>

          <ActionButtons
            submitLabel="Confirm"
            onCancel={() => form.reset(BLANK_VALUES)}
            isSubmitting={form.formState.isSubmitting}
          />
        </div>
      </div>
    </form>
  )
}
