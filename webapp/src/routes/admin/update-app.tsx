import { createFileRoute } from '@tanstack/react-router'
import { UpdateAppView } from '@/views/admin/update-app/UpdateAppView'

export const Route = createFileRoute('/admin/update-app')({
  component: UpdateAppView,
})
