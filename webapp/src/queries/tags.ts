import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay, nextId } from './mockUtils'
import type { Tag } from '@/types/admin'

let tags: Array<Tag> = [
  { id: 'tag-hr', name: 'HR', color: '#f97316', status: true },
  { id: 'tag-ops', name: 'Ops', color: '#007aff', status: true },
  { id: 'tag-dev', name: 'DEV', color: '#22c55e', status: true },
]

async function fetchTags(): Promise<Array<Tag>> {
  return delay([...tags])
}

async function fetchTag(id: string): Promise<Tag | undefined> {
  return delay(tags.find((tag) => tag.id === id))
}

export type CreateTagInput = Omit<Tag, 'id'>

async function createTag(input: CreateTagInput): Promise<Tag> {
  const tag: Tag = { ...input, id: nextId('tag') }
  tags = [...tags, tag]
  return delay(tag)
}

export type UpdateTagInput = Tag

async function updateTag(input: UpdateTagInput): Promise<Tag> {
  tags = tags.map((tag) => (tag.id === input.id ? input : tag))
  return delay(input)
}

export const tagKeys = {
  tags: ['tags'] as const,
  tag: (id: string) => ['tags', id] as const,
}

export function useTags() {
  return useQuery({ queryKey: tagKeys.tags, queryFn: fetchTags })
}

export function useTag(id: string | undefined) {
  return useQuery({
    queryKey: tagKeys.tag(id ?? ''),
    queryFn: () => fetchTag(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTagInput) => createTag(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.tags })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateTagInput) => updateTag(input),
    onSuccess: (tag) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.tags })
      queryClient.invalidateQueries({ queryKey: tagKeys.tag(tag.id) })
    },
  })
}
