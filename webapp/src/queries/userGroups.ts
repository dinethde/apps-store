import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { get } from './http'
import { useAppStore } from '@/store/appStore'
import type { UserGroup } from '@/types/admin'

/** Fetches the user groups and writes them into the store. Read-only. */
export function useUserGroupsQuery() {
  const query = useQuery({
    queryKey: ['userGroups'],
    queryFn: () => get<Array<UserGroup>>('/user-groups'),
  })
  const setUserGroups = useAppStore((state) => state.setUserGroups)

  useEffect(() => {
    if (query.data) setUserGroups(query.data)
  }, [query.data, setUserGroups])

  return query
}
