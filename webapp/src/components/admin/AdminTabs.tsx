import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Typography } from '@/components/ui/typography'
import { useAdminStore } from '@/store/useAdminStore'
import type { AdminTab } from '@/store/useAdminStore'
import { cn } from '@/lib/utils'
import { CreateAppForm } from './forms/CreateAppForm'
import { UpdateAppForm } from './forms/UpdateAppForm'
import { CreateTagForm } from './forms/CreateTagForm'
import { UpdateTagForm } from './forms/UpdateTagForm'

const TABS: Array<{ value: AdminTab; label: string }> = [
  { value: 'create-app', label: 'Add Apps' },
  { value: 'update-app', label: 'Update Apps' },
  { value: 'create-tags', label: 'Add Tags' },
  { value: 'update-tags', label: 'Update Tags' },
]

export function AdminTabs() {
  const activeTab = useAdminStore((s) => s.activeTab)
  const setActiveTab = useAdminStore((s) => s.setActiveTab)

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as AdminTab)}
      className="flex w-full flex-col gap-6"
    >
      <TabsList className="h-fit w-fit shrink-0 gap-2.5 self-start rounded-lg bg-surface-neutral-light-active p-1 shadow-sm">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'h-fit shrink-0 rounded-md border-none px-2 py-1.5',
                isActive && 'bg-brand-50 shadow-none',
              )}
            >
              <Typography
                variant={isActive ? 'p-m-medium' : 'p-m'}
                className={
                  isActive
                    ? 'text-txt-brand-p1-active'
                    : 'text-txt-primary-p3-active'
                }
              >
                {tab.label}
              </Typography>
            </TabsTrigger>
          )
        })}
      </TabsList>

      <TabsContent value="create-app">
        <CreateAppForm />
      </TabsContent>
      <TabsContent value="update-app">
        <UpdateAppForm />
      </TabsContent>
      <TabsContent value="create-tags">
        <CreateTagForm />
      </TabsContent>
      <TabsContent value="update-tags">
        <UpdateTagForm />
      </TabsContent>
    </Tabs>
  )
}
