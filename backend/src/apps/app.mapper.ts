import { AppStatus } from '@prisma/client'
import type { Prisma } from '@prisma/client'

/** Exactly `App` in webapp/src/types/admin.ts. */
export type AppResponse = {
  id: string
  name: string
  url: string
  version: string
  description: string
  tagline: string
  tagIds: Array<string>
  userGroupIds: Array<string>
  icon: { name: string; sizeLabel: string; url: string } | null
  status: boolean
}

const appWithRelations = {
  include: {
    tags: { select: { tagId: true } },
    userGroups: { select: { userGroupId: true } },
  },
} satisfies Prisma.AppDefaultArgs

export type AppWithRelations = Prisma.AppGetPayload<typeof appWithRelations>

export const APP_INCLUDE = appWithRelations.include

/**
 * The frontend's `status` is still a boolean while the column is the enum
 * from §4. TODO(webapp): drop both halves of this mapping when the admin
 * toggle becomes the three-state control described in §7.6.3.
 */
export function toStatusEnum(status: boolean): AppStatus {
  return status ? AppStatus.PUBLISHED : AppStatus.DRAFT
}

export function toAppResponse(app: AppWithRelations): AppResponse {
  return {
    id: app.id,
    name: app.name,
    url: app.url,
    version: app.version,
    description: app.description,
    tagline: app.tagline,
    tagIds: app.tags.map((tag) => tag.tagId),
    userGroupIds: app.userGroups.map((group) => group.userGroupId),
    icon:
      app.iconName === null
        ? null
        : {
            name: app.iconName,
            sizeLabel: app.iconSizeLabel ?? '',
            url: app.iconUrl ?? '',
          },
    status: app.status === AppStatus.PUBLISHED,
  }
}
