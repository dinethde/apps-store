import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PageTabs } from '@/components/PageTabs'

export const Route = createFileRoute('/admin')({ component: AdminLayout })

const ADMIN_TABS = [
  { label: 'Add Apps', to: '/admin/create-app' },
  { label: 'Update Apps', to: '/admin/update-app' },
  { label: 'Add Tags', to: '/admin/create-tags' },
  { label: 'Update Tags', to: '/admin/update-tags' },
]

function AdminLayout() {
  return (
    <div className="flex w-full flex-col gap-6">
      <PageTabs tabs={ADMIN_TABS} />
      <Outlet />
    </div>
  )
}
