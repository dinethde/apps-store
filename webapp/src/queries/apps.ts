import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getList, patch, post } from './http'
import { useAppStore } from '@/store/appStore'
import type { App } from '@/types/admin'

const appsKey = ['apps']

export type CreateAppInput = Omit<App, 'id'>
export type UpdateAppInput = App

/**
 * Fetches the apps and writes them into the store. Call it from any component
 * that needs apps; React Query dedupes the request, and the component reads
 * the list back out of the store.
 */
export function useAppsQuery() {
  const query = useQuery({
    queryKey: appsKey,
    queryFn: () => getList<App>('/apps'),
  })
  const setApps = useAppStore((state) => state.setApps)

  useEffect(() => {
    if (query.data) setApps(query.data)
  }, [query.data, setApps])

  return query
}

export function useCreateApp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAppInput) => post<App>('/apps', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: appsKey }),
  })
}

export function useUpdateApp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...changes }: UpdateAppInput) =>
      patch<App>(`/apps/${id}`, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: appsKey }),
  })
}
