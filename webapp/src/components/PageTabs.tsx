import { Link, useMatchRoute } from '@tanstack/react-router'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export type PageTab = {
  label: string
  to: string
}

type PageTabsProps = {
  tabs: Array<PageTab>
  className?: string
}

/**
 * Route-driven tab navigation: each tab is a real, bookmarkable URL rendered
 * with <Link>, not client-side tab state. The active tab is derived from the
 * currently matched route so browser back/forward and direct links work.
 */
export function PageTabs({ tabs, className }: PageTabsProps) {
  const matchRoute = useMatchRoute()
  const activeTo = tabs.find((tab) => matchRoute({ to: tab.to }))?.to

  return (
    <Tabs
      value={activeTo ?? null}
      className={cn('flex w-fit flex-col', className)}
    >
      <TabsList className="h-fit w-fit shrink-0 gap-2.5 self-start rounded-lg bg-surface-neutral-light-active p-1 shadow-sm">
        {tabs.map((tab) => {
          const isActive = tab.to === activeTo
          return (
            <TabsTrigger
              key={tab.to}
              value={tab.to}
              render={<Link to={tab.to} />}
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
                    : 'text-txt-neutral-p3-active'
                }
              >
                {tab.label}
              </Typography>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
