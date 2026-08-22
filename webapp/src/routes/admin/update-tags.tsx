import { createFileRoute } from '@tanstack/react-router'
import { UpdateTagsView } from '@/views/admin/update-tags/UpdateTagsView'

export const Route = createFileRoute('/admin/update-tags')({
  component: UpdateTagsView,
})
