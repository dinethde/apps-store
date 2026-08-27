import { useMutation } from '@tanstack/react-query'
import { delay, nextId } from './mockUtils'
import { initialTags } from './mockData'
import { useAppsStore } from '@/store/appsStore'
import type { Tag } from '@/types/admin'

let tags: Array<Tag> = [...initialTags]

export async function fetchTags(): Promise<Array<Tag>> {
  return delay([...tags])
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

export function useCreateTag() {
  return useMutation({
    mutationFn: (input: CreateTagInput) => createTag(input),
    onSuccess: (tag) => {
      useAppsStore.getState().upsertTag(tag)
    },
  })
}

export function useUpdateTag() {
  return useMutation({
    mutationFn: (input: UpdateTagInput) => updateTag(input),
    onSuccess: (tag) => {
      useAppsStore.getState().upsertTag(tag)
    },
  })
}
