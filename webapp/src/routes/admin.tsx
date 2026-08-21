import { createFileRoute } from '@tanstack/react-router'
import { AdminTabs } from '@/components/admin/AdminTabs'

export const Route = createFileRoute('/admin')({ component: Admin })

function Admin() {
  return (
    <div className="flex w-full flex-col gap-4">
      <AdminTabs />
    </div>
  )
}
