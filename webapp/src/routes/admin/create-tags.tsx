import { createFileRoute } from '@tanstack/react-router'
import { CreateTagsView } from '@/views/admin/create-tags/CreateTagsView'

export const Route = createFileRoute('/admin/create-tags')({
  component: CreateTagsView,
})
