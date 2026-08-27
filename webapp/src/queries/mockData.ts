import type { App, Tag, UserGroup } from '@/types/admin'

export const initialApps: Array<App> = [
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

export const initialTags: Array<Tag> = [
  { id: 'tag-hr', name: 'HR', color: '#f97316', status: true },
  { id: 'tag-ops', name: 'Ops', color: '#007aff', status: true },
  { id: 'tag-dev', name: 'DEV', color: '#22c55e', status: true },
]

export const initialUserGroups: Array<UserGroup> = [
  { id: 'grp-hr', name: 'HR' },
  { id: 'grp-ops', name: 'OPS' },
  { id: 'grp-dev', name: 'DEV' },
  { id: 'grp-finance', name: 'FINANCE' },
]
