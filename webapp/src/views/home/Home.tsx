import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { useAppsQuery } from '@/queries/apps'
import { useTagsQuery } from '@/queries/tags'
import { useAppStore } from '@/store/appStore'
import { ApplicationCard } from './ApplicationCard'
import { FilterModal } from './FilterModal'

export default function Home() {
  const [query, setQuery] = useState('')

  useAppsQuery()
  useTagsQuery()

  const apps = useAppStore((state) => state.apps)
  const tags = useAppStore((state) => state.tags)
  const filters = useAppStore((state) => state.filters)
  const likedAppIds = useAppStore((state) => state.likedAppIds)

  // Derived state: filter apps by search text, tags, user groups, and
  // liked status on every change
  const visibleApps = useMemo(() => {
    const q = query.trim().toLowerCase()

    return apps.filter((app) => {
      const matchesQuery =
        !q ||
        [app.name, app.tagline, app.description].some((field) =>
          field.toLowerCase().includes(q),
        )

      const matchesTags =
        filters.tagIds.length === 0 ||
        app.tagIds.some((id) => filters.tagIds.includes(id))

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

        <FilterModal />
      </div>

      {visibleApps.length ? (
        visibleApps.map((app) => (
          <ApplicationCard
            key={app.id}
            id={app.id}
            name={app.name}
            subtitle={app.tagline || app.description}
            description={app.description}
            tags={tags.filter((tag) => app.tagIds.includes(tag.id))}
            userGroupIds={app.userGroupIds}
            searchQuery={query}
          />
        ))
      ) : (
        <Typography variant="p-m" className="text-txt-neutral-p3-active">
          No apps found
        </Typography>
      )}
    </div>
  )
}
