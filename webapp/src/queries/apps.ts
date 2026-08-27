import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay, nextId } from './mockUtils'
import type { App } from '@/types/admin'

let apps: Array<App> = [
  {
    id: 'app-people',
    name: 'People App',
    url: 'https://www.people-stg.wso2.com',
    version: '1.0.0',
    description: 'Human Resources',
    tagline: 'Human Resources',
    tagIds: ['tag-hr', 'tag-ops'],
    userGroupIds: ['grp-hr', 'grp-ops', 'grp-dev'],
    icon: null,
    status: true,
  },
]

async function fetchApps(): Promise<Array<App>> {
  return delay([...apps])
}

async function fetchApp(id: string): Promise<App | undefined> {
  return delay(apps.find((app) => app.id === id))
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

export const appKeys = {
  apps: ['apps'] as const,
  app: (id: string) => ['apps', id] as const,
}

export function useApps() {
  return useQuery({ queryKey: appKeys.apps, queryFn: fetchApps })
}

export function useApp(id: string | undefined) {
  return useQuery({
    queryKey: appKeys.app(id ?? ''),
    queryFn: () => fetchApp(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateApp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAppInput) => createApp(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appKeys.apps })
    },
  })
}

export function useUpdateApp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateAppInput) => updateApp(input),
    onSuccess: (app) => {
      queryClient.invalidateQueries({ queryKey: appKeys.apps })
      queryClient.invalidateQueries({ queryKey: appKeys.app(app.id) })
    },
  })
}
