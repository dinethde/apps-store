import { Heart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Typography } from '@/components/ui/typography'
import { TagChip } from '@views/admin/components/TagChip'
import type { Tag } from '@/types/admin'

type CompanyCardProps = {
  name: string
  subtitle: string
  description: string
  tags: Array<Tag>
}

export function CompanyCard({
  name,
  subtitle,
  description,
  tags,
}: CompanyCardProps) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-xl border border-outline-neutral-light-active bg-surface-neutral-light-active p-[17px]">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-2">
          <Avatar className='size-[40px] rounded-lg after:rounded-[inherit] border-1 border-outline-neutral-main-active'>
            <AvatarImage
              src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png'
              alt='Hallie Richards'
              className='rounded-sm'
            />
            <AvatarFallback>HR</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-0.5">
            <Typography
              variant="p-medium"
              className="text-txt-neutral-p2-active"
            >
              {name}
            </Typography>
            <Typography variant="p-s" className="text-txt-neutral-p3-active">
              {subtitle}
            </Typography>
          </div>
        </div>
        <Heart size={20} className="shrink-0 text-txt-neutral-p4-active" />
      </div>

      <div className="w-full border-t border-outline-neutral-light-active" />

      <Typography variant="p-m" className="w-full text-txt-neutral-p2-active">
        {description}
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
