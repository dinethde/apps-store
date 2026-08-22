import { Heart } from 'lucide-react'
import { Typography } from '@/components/ui/typography'
import { TagChip } from './TagChip'
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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-fill-secondary-main-active">
            <Typography variant="p-m-medium" className="text-white">
              {initials}
            </Typography>
          </div>
          <div className="flex flex-col gap-0.5">
            <Typography
              variant="p-medium"
              className="text-txt-primary-p2-active"
            >
              {name}
            </Typography>
            <Typography variant="p-s" className="text-txt-primary-p3-active">
              {subtitle}
            </Typography>
          </div>
        </div>
        <Heart className="size-[18px] shrink-0 text-txt-primary-p4-active" />
      </div>

      <div className="w-full border-t border-outline-neutral-light-active" />

      <Typography variant="p-m" className="w-full text-txt-primary-p2-active">
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
