import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { updateAppFormSchema } from '@/lib/adminSchemas'
import type { UpdateAppFormValues } from '@/lib/adminSchemas'
import {
  useApp,
  useApps,
  useTags,
  useUpdateApp,
  useUserGroups,
} from '@/hooks/useAdminQueries'
import { useAdminStore } from '@/store/useAdminStore'
import { TextField } from '../fields/TextField'
import { TextareaField } from '../fields/TextareaField'
import { MultiAutocompleteField } from '../fields/MultiAutocompleteField'
import { FileUploadField } from '../fields/FileUploadField'
import { SwitchField } from '../fields/SwitchField'
import { SingleAutocompleteField } from '../fields/SingleAutocompleteField'
import { ActionButtons } from '../ActionButtons'
import { CompanyCard } from '../CompanyCard'

const EMPTY_VALUES: UpdateAppFormValues = {
  appId: '',
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

export function UpdateAppForm() {
  const { data: apps = [], isLoading: appsLoading } = useApps()
  const { data: tags = [] } = useTags()
  const { data: userGroups = [] } = useUserGroups()
  const selectedAppId = useAdminStore((s) => s.selectedAppId)
  const setSelectedAppId = useAdminStore((s) => s.setSelectedAppId)
  const { data: selectedApp } = useApp(selectedAppId ?? undefined)
  const updateApp = useUpdateApp()

  const schema = useMemo(
    () =>
      updateAppFormSchema(
        apps.map((a) => a.name),
        selectedApp?.name ?? '',
      ),
    [apps, selectedApp],
  )

  const form = useForm<UpdateAppFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!selectedApp) return
    form.reset({
      appId: selectedApp.id,
      name: selectedApp.name,
      url: selectedApp.url,
      version: selectedApp.version,
      description: selectedApp.description,
      tagline: selectedApp.tagline,
      tagIds: selectedApp.tagIds,
      userGroupIds: selectedApp.userGroupIds,
      icon: null,
      status: selectedApp.status,
    })
  }, [selectedApp, form])

  const tagOptions = tags.map((t) => ({
    id: t.id,
    label: t.name,
    color: t.color,
  }))
  const userGroupOptions = userGroups.map((g) => ({ id: g.id, label: g.name }))
  const appOptions = apps.map((a) => ({ id: a.id, label: a.name }))
  const appTags = tags.filter((t) => selectedApp?.tagIds.includes(t.id))
  const fieldsDisabled = !selectedApp

  const resetToEmpty = () => {
    setSelectedAppId(null)
    form.reset(EMPTY_VALUES)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    await updateApp.mutateAsync({
      id: values.appId,
      name: values.name,
      url: values.url,
      version: values.version,
      description: values.description,
      tagline: values.tagline ?? '',
      tagIds: values.tagIds,
      userGroupIds: values.userGroupIds,
      icon: selectedApp?.icon ?? null,
      status: values.status,
    })
    toast.success(`"${values.name}" was updated successfully`)
  })

  return (
    <form onSubmit={onSubmit} className="flex w-full items-start gap-5">
      <div className="flex w-[388px] shrink-0 flex-col items-start gap-4">
        <SingleAutocompleteField
          control={form.control}
          name="appId"
          label="Select an app"
          options={appOptions}
          isLoading={appsLoading}
          onSelect={(id) => setSelectedAppId(id)}
        />
        {selectedApp ? (
          <CompanyCard
            name={selectedApp.name}
            subtitle={selectedApp.tagline || selectedApp.description}
            description={selectedApp.description}
            tags={appTags}
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
        <TextField
          control={form.control}
          name="name"
          label="App Name"
          placeholder="placeholder"
          disabled={fieldsDisabled}
        />
        <TextField
          control={form.control}
          name="url"
          label="App URL"
          placeholder="placeholder"
          disabled={fieldsDisabled}
        />
        <TextField
          control={form.control}
          name="version"
          label="App Version"
          placeholder="placeholder"
          disabled={fieldsDisabled}
        />
        <TextareaField
          control={form.control}
          name="description"
          label="App Description"
          placeholder="placeholder"
          disabled={fieldsDisabled}
        />
        <TextField
          control={form.control}
          name="tagline"
          label="Tagline"
          placeholder="placeholder"
          disabled={fieldsDisabled}
        />
        <MultiAutocompleteField
          control={form.control}
          name="tagIds"
          label="Tags"
          options={tagOptions}
          disabled={fieldsDisabled}
        />
        <MultiAutocompleteField
          control={form.control}
          name="userGroupIds"
          label="User Groups"
          options={userGroupOptions}
          disabled={fieldsDisabled}
        />
        <FileUploadField
          control={form.control}
          name="icon"
          label="App Icon"
          disabled={fieldsDisabled}
        />
        <SwitchField
          control={form.control}
          name="status"
          label="App Status"
          disabled={fieldsDisabled}
        />

        <ActionButtons
          submitLabel="Update"
          onCancel={resetToEmpty}
          isSubmitting={form.formState.isSubmitting}
          disabled={fieldsDisabled}
        />
      </div>
    </form>
  )
}
