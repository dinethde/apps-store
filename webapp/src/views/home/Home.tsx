import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { useAppsStore } from '@/store/appsStore'
import { ApplicationCard } from './ApplicationCard'
import { FiltersPopover } from './FiltersPopover'

export default function Home() {
  const [query, setQuery] = useState('')

  const apps = useAppsStore((state) => state.apps)
  const filters = useAppsStore((state) => state.filters)
  const likedAppIds = useAppsStore((state) => state.likedAppIds)

  // Derived state: filter apps by search text, tags, user groups, and
  // liked status on every change
  const visibleApps = useMemo(() => {
    const q = query.trim().toLowerCase()

    return apps.filter((app) => {
      const matchesQuery =
        !q ||
        [app.name, app.subtitle, app.description].some((field) =>
          field.toLowerCase().includes(q),
        )

      const matchesTags =
        filters.tagIds.length === 0 ||
        app.tags.some((tag) => filters.tagIds.includes(tag.id))

      const matchesUserGroups =
        filters.userGroupIds.length === 0 ||
        app.userGroupIds.some((id) => filters.userGroupIds.includes(id))

      const matchesLiked = !filters.likedOnly || Boolean(likedAppIds[app.id])

      return matchesQuery && matchesTags && matchesUserGroups && matchesLiked
    })
  }, [apps, query, filters, likedAppIds])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center gap-2">
        <div className="relative w-full">
          <Search
            className={`pointer-events-none absolute top-1/2 left-3 size-4
              -translate-y-1/2 text-user_input-default-text`}
          />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps..."
            aria-label="Search apps"
            className={`h-[33px] border-user_input-default-border
              bg-user_input-default-bg pl-9 text-p-m
              text-user_input-default-text placeholder:text-p-m
              placeholder:text-user_input-default-text
              hover:border-user_input-hover-border
              focus-visible:border-user_input-focussed-border
              focus-visible:ring-3
              focus-visible:ring-user_input-focussed-shadow`}
          />
        </div>

        <FiltersPopover />
      </div>

      {visibleApps.length ? (
        visibleApps.map((app) => (
          <ApplicationCard key={app.id} {...app} searchQuery={query} />
        ))
      ) : (
        <Typography variant="p-m" className="text-txt-neutral-p3-active">
          No apps found
        </Typography>
      )}
    </div>
  )
}
