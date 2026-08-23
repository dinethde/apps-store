import { createFileRoute } from '@tanstack/react-router'
import { CreateAppView } from '@/views/admin/create-app/CreateAppView'

export const Route = createFileRoute('/admin/create-app')({
  component: CreateAppView,
})
