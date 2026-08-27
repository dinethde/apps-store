import { Heart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Typography } from '@/components/ui/typography'
import { HighlightText } from '@/components/ui/highlight-text'
import { TagChip } from '@views/admin/components/TagChip'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/admin'

type ApplicationCardProps = {
  id: string
  name: string
  subtitle: string
  description: string
  tags: Array<Tag>
  userGroupIds: Array<string>
  searchQuery?: string
}

export function ApplicationCard({
  id,
  name,
  subtitle,
  description,
  tags,
  searchQuery = '',
}: ApplicationCardProps) {
  const liked = useAppStore((state) => Boolean(state.likedAppIds[id]))
  const toggleLiked = useAppStore((state) => state.toggleLiked)

  return (
    <div
      className={`flex w-full flex-col items-start gap-4 rounded-xl border
        border-outline-neutral-light-active bg-surface-neutral-light-active
        p-[17px]`}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            className={`size-[40px] rounded-lg border-1
              border-outline-neutral-main-active after:rounded-[inherit]`}
          >
            <AvatarImage
              src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
              alt="Hallie Richards"
              className="rounded-sm"
            />
            <AvatarFallback>HR</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0.5">
            <Typography
              variant="p-medium"
              className="text-txt-neutral-p2-active"
            >
              <HighlightText text={name} query={searchQuery} />
            </Typography>

            <Typography variant="p-s" className="text-txt-neutral-p3-active">
              <HighlightText text={subtitle} query={searchQuery} />
            </Typography>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleLiked(id)}
          aria-pressed={liked}
          aria-label={liked ? `Unlike ${name}` : `Like ${name}`}
          className="shrink-0"
        >
          <Heart
            size={20}
            className={cn(
              'transition-colors',
              liked
                ? 'fill-txt-error-p1-active text-txt-error-p1-active'
                : 'text-txt-neutral-p4-active',
            )}
          />
        </button>
      </div>

      <div className="w-full border-t border-outline-neutral-light-active" />

      <Typography variant="p-m" className="w-full text-txt-neutral-p2-active">
        <HighlightText text={description} query={searchQuery} />
      </Typography>

      {tags.length ? (
        <div className="flex w-full items-center gap-3">
          {tags.map((tag) => (
            <TagChip key={tag.id} label={tag.name} color={tag.color} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
