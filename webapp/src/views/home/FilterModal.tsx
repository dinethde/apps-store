import type { ReactNode } from 'react'
import FilterIcon from '@assets/filter-icon.svg?react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Typography } from '@/components/ui/typography'
import { Chip } from '@/components/Chip'
import { TagChip } from '@/components/TagChip'
import { useTagsQuery } from '@/queries/tags'
import { useUserGroupsQuery } from '@/queries/userGroups'
import { useAppStore } from '@/store/appStore'

function toggleId(list: Array<string>, id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
}

/**
 * A section of selectable chips. Selected chips sit on their own row above the
 * rest and carry a cross to deselect; unselected chips are dimmed until
 * hovered.
 */
function FilterSection<T extends { id: string; name: string }>({
  title,
  items,
  selectedIds,
  onToggle,
  renderChip,
}: {
  title: string
  items: Array<T>
  selectedIds: Array<string>
  onToggle: (id: string) => void
  renderChip: (item: T, onRemove?: () => void) => ReactNode
}) {
  if (!items.length) return null

  const selected = items.filter((item) => selectedIds.includes(item.id))
  const unselected = items.filter((item) => !selectedIds.includes(item.id))

  return (
    <div className="flex w-full flex-col gap-4">
      <Typography variant="p-m-medium" className="text-txt-neutral-p2-active">
        {title}
      </Typography>

      <div className="flex w-full flex-col items-start justify-center gap-4">
        {selected.length ? (
          <div className="flex flex-wrap items-center gap-3">
            {selected.map((item) => (
              <span key={item.id}>
                {renderChip(item, () => onToggle(item.id))}
              </span>
            ))}
          </div>
        ) : null}

        {unselected.length ? (
          <div
            className={
              'flex w-full flex-wrap content-center items-center gap-2'
            }
          >
            {unselected.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id)}
                aria-pressed={false}
                className={`cursor-pointer rounded-[4px] opacity-60
                  transition-opacity outline-none hover:opacity-100
                  focus-visible:opacity-100 focus-visible:ring-2
                  focus-visible:ring-ring/50`}
              >
                {renderChip(item)}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function FilterModal() {
  useTagsQuery()
  useUserGroupsQuery()

  const tags = useAppStore((state) => state.tags)
  const userGroups = useAppStore((state) => state.userGroups)

  const filters = useAppStore((state) => state.filters)
  const setTagFilter = useAppStore((state) => state.setTagFilter)
  const setUserGroupFilter = useAppStore((state) => state.setUserGroupFilter)
  const setLikedOnly = useAppStore((state) => state.setLikedOnly)
  const clearFilters = useAppStore((state) => state.clearFilters)

  const activeCount =
    filters.tagIds.length +
    filters.userGroupIds.length +
    (filters.likedOnly ? 1 : 0)

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            aria-label="Filter apps"
            className={`relative h-[33px] shrink-0 gap-2 rounded-lg
            border-outline-neutral-light-active bg-surface-neutral-light-active
            px-[9px] text-p-m-medium text-txt-neutral-p3-active
            hover:bg-surface-neutral-main-hover`}
          >
            <FilterIcon className="size-3.5" />
            Filter
            {activeCount ? (
              <span
                className={`absolute -top-1.5 -right-1.5 flex size-4
                  items-center justify-center rounded-full bg-brand-main
                  text-[10px] text-white`}
              >
                {activeCount}
              </span>
            ) : null}
          </Button>
        }
      />

      <PopoverContent
        align="end"
        sideOffset={8}
        className={`w-[260px] gap-5 rounded-xl border
          border-outline-neutral-light-active bg-surface-neutral-light-active
          p-4 shadow-[0px_1px_4px_0px_#e0e5eb] ring-0`}
      >
        <div className="flex w-full items-center justify-between">
          <PopoverTitle
            className="text-p-medium text-txt-neutral-p2-active"
            render={<h2 />}
          >
            Filters
          </PopoverTitle>

          {activeCount ? (
            <button
              type="button"
              onClick={clearFilters}
              className={`cursor-pointer text-p-s-medium text-warnings-main
                outline-none hover:underline focus-visible:underline`}
            >
              Clear all
            </button>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-4">
          <label
            className={
              'flex w-full cursor-pointer items-center justify-between'
            }
          >
            <Typography
              variant="p-m-medium"
              className="text-txt-neutral-p2-active"
            >
              Liked by me
            </Typography>
            <Switch
              checked={filters.likedOnly}
              onCheckedChange={(checked) => setLikedOnly(Boolean(checked))}
              className={`data-checked:bg-fill-success-main-active
                data-unchecked:bg-fill-neutral-main-active`}
            />
          </label>

          <div className="h-px w-full bg-outline-neutral-light-active" />

          <FilterSection
            title="Tags"
            items={tags}
            selectedIds={filters.tagIds}
            onToggle={(id) => setTagFilter(toggleId(filters.tagIds, id))}
            renderChip={(tag, onRemove) => (
              <TagChip label={tag.name} color={tag.color} onRemove={onRemove} />
            )}
          />

          {tags.length && userGroups.length ? (
            <div className="h-px w-full bg-outline-neutral-light-active" />
          ) : null}

          <FilterSection
            title="User Groups"
            items={userGroups}
            selectedIds={filters.userGroupIds}
            onToggle={(id) =>
              setUserGroupFilter(toggleId(filters.userGroupIds, id))
            }
            renderChip={(group, onRemove) => (
              <Chip label={group.name} onRemove={onRemove} />
            )}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
