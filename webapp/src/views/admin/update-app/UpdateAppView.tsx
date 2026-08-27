import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { updateAppFormSchema } from './updateAppSchema'
import type { UpdateAppFormValues } from './updateAppSchema'
import { useUpdateApp } from '@/queries/apps'
import { selectAppTags, useAppsStore } from '@/store/appsStore'
import { TextField } from '../components/fields/TextField'
import { TextareaField } from '../components/fields/TextareaField'
import { MultiAutocompleteField } from '../components/fields/MultiAutocompleteField'
import { FileUploadField } from '../components/fields/FileUploadField'
import { SwitchField } from '../components/fields/SwitchField'
import { SingleAutocompleteField } from '../components/fields/SingleAutocompleteField'
import { ActionButtons } from '../components/ActionButtons'
import { ApplicationCard } from '@views/home/ApplicationCard'

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

export function UpdateAppView() {
  const apps = useAppsStore((state) => state.apps)
  const tags = useAppsStore((state) => state.tags)
  const userGroups = useAppsStore((state) => state.userGroups)
  const appsLoading = useAppsStore((state) => state.isLoading)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const selectedApp = apps.find((app) => app.id === selectedAppId)
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
  const appTags = selectedApp ? selectAppTags(selectedApp, tags) : []
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
          placeholder="example app"
          label="Select an app"
          options={appOptions}
          isLoading={appsLoading}
          onSelect={(id) => setSelectedAppId(id)}
        />
        {selectedApp ? (
          <ApplicationCard
            id={selectedApp.id}
            name={selectedApp.name}
            subtitle={selectedApp.tagline || selectedApp.description}
            description={selectedApp.description}
            tags={appTags}
            userGroupIds={selectedApp.userGroupIds}
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
