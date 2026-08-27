import { create } from 'zustand'
import { fetchApps } from '@/queries/apps'
import { fetchTags } from '@/queries/tags'
import { fetchUserGroups } from '@/queries/userGroups'
import type { App, Tag, UserGroup } from '@/types/admin'

type AppsFilters = {
  tagIds: Array<string>
  userGroupIds: Array<string>
  likedOnly: boolean
}

type AppsStore = {
  apps: Array<App>
  tags: Array<Tag>
  userGroups: Array<UserGroup>
  isLoading: boolean
  isInitialized: boolean
  init: () => Promise<void>
  upsertApp: (app: App) => void
  upsertTag: (tag: Tag) => void
  likedAppIds: Record<string, boolean>
  toggleLiked: (id: string) => void
  filters: AppsFilters
  setTagFilter: (tagIds: Array<string>) => void
  setUserGroupFilter: (userGroupIds: Array<string>) => void
  setLikedOnly: (likedOnly: boolean) => void
  clearFilters: () => void
}

const initialFilters: AppsFilters = {
  tagIds: [],
  userGroupIds: [],
  likedOnly: false,
}

export const useAppsStore = create<AppsStore>((set, get) => ({
  apps: [],
  tags: [],
  userGroups: [],
  isLoading: false,
  isInitialized: false,
  init: async () => {
    if (get().isInitialized || get().isLoading) return
    set({ isLoading: true })
    const [apps, tags, userGroups] = await Promise.all([
      fetchApps(),
      fetchTags(),
      fetchUserGroups(),
    ])
    set({ apps, tags, userGroups, isLoading: false, isInitialized: true })
  },
  upsertApp: (app) =>
    set((state) => {
      const exists = state.apps.some((a) => a.id === app.id)
      return {
        apps: exists
          ? state.apps.map((a) => (a.id === app.id ? app : a))
          : [...state.apps, app],
      }
    }),
  upsertTag: (tag) =>
    set((state) => {
      const exists = state.tags.some((t) => t.id === tag.id)
      return {
        tags: exists
          ? state.tags.map((t) => (t.id === tag.id ? tag : t))
          : [...state.tags, tag],
      }
    }),
  likedAppIds: {},
  toggleLiked: (id) =>
    set((state) => ({
      likedAppIds: { ...state.likedAppIds, [id]: !state.likedAppIds[id] },
    })),
  filters: initialFilters,
  setTagFilter: (tagIds) =>
    set((state) => ({ filters: { ...state.filters, tagIds } })),
  setUserGroupFilter: (userGroupIds) =>
    set((state) => ({ filters: { ...state.filters, userGroupIds } })),
  setLikedOnly: (likedOnly) =>
    set((state) => ({ filters: { ...state.filters, likedOnly } })),
  clearFilters: () => set({ filters: initialFilters }),
}))

export function selectAppTags(app: App, tags: Array<Tag>): Array<Tag> {
  return tags.filter((tag) => app.tagIds.includes(tag.id))
}
