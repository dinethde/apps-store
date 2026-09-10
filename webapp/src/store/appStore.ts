import { create } from 'zustand'
import type { App, Tag, UserGroup } from '@/types/admin'

type Filters = {
  tagIds: Array<string>
  userGroupIds: Array<string>
  likedOnly: boolean
}

const NO_FILTERS: Filters = { tagIds: [], userGroupIds: [], likedOnly: false }

type AppStore = {
  // Server data. Set by the query hooks in src/queries when a fetch resolves.
  apps: Array<App>
  tags: Array<Tag>
  userGroups: Array<UserGroup>
  setApps: (apps: Array<App>) => void
  setTags: (tags: Array<Tag>) => void
  setUserGroups: (userGroups: Array<UserGroup>) => void

  // Client state. Lives here and nowhere else.
  filters: Filters
  likedAppIds: Record<string, boolean>
  setTagFilter: (tagIds: Array<string>) => void
  setUserGroupFilter: (userGroupIds: Array<string>) => void
  setLikedOnly: (likedOnly: boolean) => void
  clearFilters: () => void
  toggleLiked: (id: string) => void
}

/**
 * The one store the UI reads from.
 *
 * Components call a query hook (useAppsQuery, useTagsQuery,
 * useUserGroupsQuery) to trigger the fetch, and the hook calls the matching
 * setter below. Rendering always reads the store, never the query result.
 */
export const useAppStore = create<AppStore>((set) => ({
  apps: [],
  tags: [],
  userGroups: [],
  setApps: (apps) => set({ apps }),
  setTags: (tags) => set({ tags }),
  setUserGroups: (userGroups) => set({ userGroups }),

  filters: NO_FILTERS,
  likedAppIds: {},
  setTagFilter: (tagIds) =>
    set((state) => ({ filters: { ...state.filters, tagIds } })),
  setUserGroupFilter: (userGroupIds) =>
    set((state) => ({ filters: { ...state.filters, userGroupIds } })),
  setLikedOnly: (likedOnly) =>
    set((state) => ({ filters: { ...state.filters, likedOnly } })),
  clearFilters: () => set({ filters: NO_FILTERS }),
  toggleLiked: (id) =>
    set((state) => ({
      likedAppIds: { ...state.likedAppIds, [id]: !state.likedAppIds[id] },
    })),
}))
