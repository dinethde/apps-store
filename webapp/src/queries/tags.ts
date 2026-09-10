import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getList, patch, post } from './http'
import { useAppStore } from '@/store/appStore'
import type { Tag } from '@/types/admin'

const tagsKey = ['tags']

export type CreateTagInput = Omit<Tag, 'id'>
export type UpdateTagInput = Tag

/** Fetches the tags and writes them into the store. */
export function useTagsQuery() {
  const query = useQuery({
    queryKey: tagsKey,
    queryFn: () => getList<Tag>('/tags'),
  })
  const setTags = useAppStore((state) => state.setTags)

  useEffect(() => {
    if (query.data) setTags(query.data)
  }, [query.data, setTags])

  return query
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTagInput) => post<Tag>('/tags', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagsKey }),
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...changes }: UpdateTagInput) =>
      patch<Tag>(`/tags/${id}`, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagsKey }),
  })
}
