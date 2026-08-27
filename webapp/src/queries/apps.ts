import { useMutation } from '@tanstack/react-query'
import { delay, nextId } from './mockUtils'
import { initialApps } from './mockData'
import { useAppsStore } from '@/store/appsStore'
import type { App } from '@/types/admin'

let apps: Array<App> = [...initialApps]

export async function fetchApps(): Promise<Array<App>> {
  return delay([...apps])
}

export type CreateAppInput = Omit<App, 'id'>

async function createApp(input: CreateAppInput): Promise<App> {
  const app: App = { ...input, id: nextId('app') }
  apps = [...apps, app]
  return delay(app)
}

export type UpdateAppInput = App

async function updateApp(input: UpdateAppInput): Promise<App> {
  apps = apps.map((app) => (app.id === input.id ? input : app))
  return delay(input)
}

export function useCreateApp() {
  return useMutation({
    mutationFn: (input: CreateAppInput) => createApp(input),
    onSuccess: (app) => {
      useAppsStore.getState().upsertApp(app)
    },
  })
}

export function useUpdateApp() {
  return useMutation({
    mutationFn: (input: UpdateAppInput) => updateApp(input),
    onSuccess: (app) => {
      useAppsStore.getState().upsertApp(app)
    },
  })
}
