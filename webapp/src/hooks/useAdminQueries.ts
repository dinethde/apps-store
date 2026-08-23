import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createApp,
  createTag,
  fetchApp,
  fetchApps,
  fetchTag,
  fetchTags,
  fetchUserGroups,
  updateApp,
  updateTag,
} from '@/services/adminApi'
import type {
  CreateAppInput,
  CreateTagInput,
  UpdateAppInput,
  UpdateTagInput,
} from '@/services/adminApi'

export const adminKeys = {
  apps: ['admin', 'apps'] as const,
  app: (id: string) => ['admin', 'apps', id] as const,
  tags: ['admin', 'tags'] as const,
  tag: (id: string) => ['admin', 'tags', id] as const,
  userGroups: ['admin', 'user-groups'] as const,
}

export function useApps() {
  return useQuery({ queryKey: adminKeys.apps, queryFn: fetchApps })
}

export function useApp(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.app(id ?? ''),
    queryFn: () => fetchApp(id as string),
    enabled: Boolean(id),
  })
}

export function useTags() {
  return useQuery({ queryKey: adminKeys.tags, queryFn: fetchTags })
}

export function useTag(id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.tag(id ?? ''),
    queryFn: () => fetchTag(id as string),
    enabled: Boolean(id),
  })
}

export function useUserGroups() {
  return useQuery({ queryKey: adminKeys.userGroups, queryFn: fetchUserGroups })
}

export function useCreateApp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAppInput) => createApp(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.apps })
    },
  })
}

export function useUpdateApp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateAppInput) => updateApp(input),
    onSuccess: (app) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.apps })
      queryClient.invalidateQueries({ queryKey: adminKeys.app(app.id) })
    },
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTagInput) => createTag(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tags })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateTagInput) => updateTag(input),
    onSuccess: (tag) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tags })
      queryClient.invalidateQueries({ queryKey: adminKeys.tag(tag.id) })
    },
  })
}
