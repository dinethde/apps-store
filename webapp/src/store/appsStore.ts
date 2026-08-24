import { create } from 'zustand'
import type { Tag } from '@/types/admin'

export type HomeApplication = {
  id: string
  name: string
  subtitle: string
  description: string
  tags: Array<Tag>
  userGroupIds: Array<string>
}

type AppsFilters = {
  tagIds: Array<string>
  userGroupIds: Array<string>
  likedOnly: boolean
}

type AppsStore = {
  apps: Array<HomeApplication>
  likedAppIds: Record<string, boolean>
  toggleLiked: (id: string) => void
  filters: AppsFilters
  setTagFilter: (tagIds: Array<string>) => void
  setUserGroupFilter: (userGroupIds: Array<string>) => void
  setLikedOnly: (likedOnly: boolean) => void
  clearFilters: () => void
}

const initialApps: Array<HomeApplication> = [
  {
    id: 'app-1',
    name: 'People App',
    subtitle: 'Technology',
    description:
      'Lorem ipsum dolor sit amet consectetur. Eu sit purus ac tempus',
    tags: [{ id: 'tag-hr', name: 'HR', color: '#f97316', status: true }],
    userGroupIds: ['grp-hr', 'grp-ops'],
  },
  {
    id: 'app-2',
    name: 'Finance Hub',
    subtitle: 'Finance',
    description:
      'Lorem ipsum dolor sit amet consectetur. Vulputate velit euismod sed adipiscing',
    tags: [
      { id: 'tag-finance', name: 'Finance', color: '#22c55e', status: true },
    ],
    userGroupIds: ['grp-finance'],
  },
  {
    id: 'app-3',
    name: 'Design Studio',
    subtitle: 'Creative',
    description:
      'Lorem ipsum dolor sit amet consectetur. Amet risus nullam eget felis eget nunc',
    tags: [
      { id: 'tag-design', name: 'Design', color: '#a855f7', status: true },
      {
        id: 'tag-marketing',
        name: 'Marketing',
        color: '#3b82f6',
        status: true,
      },
    ],
    userGroupIds: ['grp-dev', 'grp-ops'],
  },
  {
    id: 'app-4',
    name: 'Task Tracker',
    subtitle: 'Productivity',
    description:
      'Lorem ipsum dolor sit amet consectetur. Faucibus in hac habitasse platea dictumst',
    tags: [
      { id: 'tag-ops', name: 'Operations', color: '#eab308', status: true },
    ],
    userGroupIds: ['grp-ops'],
  },
]

const initialFilters: AppsFilters = {
  tagIds: [],
  userGroupIds: [],
  likedOnly: false,
}

export const useAppsStore = create<AppsStore>((set) => ({
  apps: initialApps,
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
