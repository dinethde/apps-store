import type { App, Tag, UserGroup } from '@/types/admin'

// Sample in-memory API. Swap these for real `/api/admin/*` endpoints once
// the backend is available - the function signatures below are the contract
// the UI depends on.

let tags: Array<Tag> = [
  { id: 'tag-hr', name: 'HR', color: '#f97316', status: true },
  { id: 'tag-ops', name: 'Ops', color: '#007aff', status: true },
  { id: 'tag-dev', name: 'DEV', color: '#22c55e', status: true },
]

const userGroups: Array<UserGroup> = [
  { id: 'grp-hr', name: 'HR' },
  { id: 'grp-ops', name: 'OPS' },
  { id: 'grp-dev', name: 'DEV' },
  { id: 'grp-finance', name: 'FINANCE' },
]

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

const LATENCY_MS = 500

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export async function fetchApps(): Promise<Array<App>> {
  return delay([...apps])
}

export async function fetchApp(id: string): Promise<App | undefined> {
  return delay(apps.find((app) => app.id === id))
}

export type CreateAppInput = Omit<App, 'id'>

export async function createApp(input: CreateAppInput): Promise<App> {
  const app: App = { ...input, id: nextId('app') }
  apps = [...apps, app]
  return delay(app)
}

export type UpdateAppInput = App

export async function updateApp(input: UpdateAppInput): Promise<App> {
  apps = apps.map((app) => (app.id === input.id ? input : app))
  return delay(input)
}

export async function fetchTags(): Promise<Array<Tag>> {
  return delay([...tags])
}

export async function fetchTag(id: string): Promise<Tag | undefined> {
  return delay(tags.find((tag) => tag.id === id))
}

export type CreateTagInput = Omit<Tag, 'id'>

export async function createTag(input: CreateTagInput): Promise<Tag> {
  const tag: Tag = { ...input, id: nextId('tag') }
  tags = [...tags, tag]
  return delay(tag)
}

export type UpdateTagInput = Tag

export async function updateTag(input: UpdateTagInput): Promise<Tag> {
  tags = tags.map((tag) => (tag.id === input.id ? input : tag))
  return delay(input)
}

export async function fetchUserGroups(): Promise<Array<UserGroup>> {
  return delay([...userGroups])
}
