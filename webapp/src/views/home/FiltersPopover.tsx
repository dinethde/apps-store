import { Check, ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Typography } from '@/components/ui/typography'
import { useTagsQuery } from '@/queries/tags'
import { useUserGroupsQuery } from '@/queries/userGroups'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

function toggleId(list: Array<string>, id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
}

function FilterOption({
  label,
  checked,
  onToggle,
}: {
  label: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`flex w-full items-center gap-2 rounded-md px-1.5 py-1.5
        text-left hover:bg-surface-neutral-main-hover`}
    >
      <span
        className={cn(
          `flex size-4 shrink-0 items-center justify-center rounded-[4px]
          border`,
          checked
            ? 'border-brand-main bg-brand-main text-white'
            : 'border-outline-neutral-main-active',
        )}
      >
        {checked ? <Check className="size-3" /> : null}
      </span>
      <Typography variant="p-s" className="text-txt-neutral-p2-active">
        {label}
      </Typography>
    </button>
  )
}

export function FiltersPopover() {
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
            size="icon"
            aria-label="Filter apps"
            className={`relative h-[33px] w-[33px] shrink-0
            border-user_input-default-border bg-user_input-default-bg
            hover:border-user_input-hover-border`}
          >
            <ListFilter className="size-4 text-user_input-default-text" />
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

      <PopoverContent className="w-72">
        <PopoverHeader className="flex-row items-center justify-between">
          <PopoverTitle>Filters</PopoverTitle>
          {activeCount ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-p-s text-txt-brand-p1-active hover:underline"
            >
              Clear all
            </button>
          ) : null}
        </PopoverHeader>

        <label className="flex cursor-pointer items-center justify-between py-1">
          <Typography variant="p-s" className="text-txt-neutral-p2-active">
            Liked by me
          </Typography>
          <Switch
            checked={filters.likedOnly}
            onCheckedChange={(checked) => setLikedOnly(Boolean(checked))}
            className={`data-checked:bg-fill-success-main-active
              data-unchecked:bg-fill-neutral-main-active`}
          />
        </label>

        {userGroups.length ? (
          <div
            className={`flex flex-col gap-1 border-t
              border-outline-neutral-light-active pt-2`}
          >
            <Typography
              variant="p-s"
              className="px-1.5 text-txt-neutral-p3-active"
            >
              User groups
            </Typography>
            {userGroups.map((group) => (
              <FilterOption
                key={group.id}
                label={group.name}
                checked={filters.userGroupIds.includes(group.id)}
                onToggle={() =>
                  setUserGroupFilter(toggleId(filters.userGroupIds, group.id))
                }
              />
            ))}
          </div>
        ) : null}

        {tags.length ? (
          <div
            className={`flex flex-col gap-1 border-t
              border-outline-neutral-light-active pt-2`}
          >
            <Typography
              variant="p-s"
              className="px-1.5 text-txt-neutral-p3-active"
            >
              Tags
            </Typography>
            {tags.map((tag) => (
              <FilterOption
                key={tag.id}
                label={tag.name}
                checked={filters.tagIds.includes(tag.id)}
                onToggle={() => setTagFilter(toggleId(filters.tagIds, tag.id))}
              />
            ))}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
