import { useQuery } from '@tanstack/react-query'
import { delay } from './mockUtils'
import type { UserGroup } from '@/types/admin'

const userGroups: Array<UserGroup> = [
  { id: 'grp-hr', name: 'HR' },
  { id: 'grp-ops', name: 'OPS' },
  { id: 'grp-dev', name: 'DEV' },
  { id: 'grp-finance', name: 'FINANCE' },
]

async function fetchUserGroups(): Promise<Array<UserGroup>> {
  return delay([...userGroups])
}

export const userGroupKeys = {
  userGroups: ['user-groups'] as const,
}

export function useUserGroups() {
  return useQuery({
    queryKey: userGroupKeys.userGroups,
    queryFn: fetchUserGroups,
  })
}
