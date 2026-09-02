import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CurrentUserService } from '../common/current-user.service'
import { AppsRepository } from './apps.repository'
import { APP_INCLUDE, toAppResponse, toStatusEnum } from './app.mapper'
import { listEnvelope } from '../common/list-envelope'
import type { ListEnvelope } from '../common/list-envelope'
import type { AppResponse } from './app.mapper'
import type { CreateAppDto } from './dto/create-app.dto'
import type { UpdateAppDto } from './dto/update-app.dto'
import type { ListAppsQueryDto } from './dto/list-apps-query.dto'

@Injectable()
export class AppsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: AppsRepository,
    private readonly currentUser: CurrentUserService,
  ) {}

  async list(query: ListAppsQueryDto): Promise<ListEnvelope<AppResponse>> {
    const user = await this.currentUser.get()
    const where = {
      ...this.repository.visibleWhere(user),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: 'insensitive' as const } },
              { tagline: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    }

    const [apps, total] = await this.repository.findMany(
      where,
      query.page,
      query.pageSize,
    )

    return listEnvelope(apps.map(toAppResponse), {
      page: query.page,
      pageSize: query.pageSize,
      total,
    })
  }

  async findOne(id: string): Promise<AppResponse> {
    const user = await this.currentUser.get()
    const app = await this.repository.findOne({
      ...this.repository.visibleWhere(user),
      id,
    })
    // §5.5: an app the caller may not see is a 404, never a 403.
    if (!app) throw new NotFoundException('No app with that id.')
    return toAppResponse(app)
  }

  async create(input: CreateAppDto): Promise<AppResponse> {
    const user = await this.currentUser.get()
    const app = await this.prisma.app.create({
      data: {
        name: input.name,
        url: input.url,
        version: input.version,
        description: input.description,
        tagline: input.tagline,
        status: toStatusEnum(input.status),
        iconName: input.icon?.name ?? null,
        iconSizeLabel: input.icon?.sizeLabel ?? null,
        iconUrl: input.icon?.url ?? null,
        createdById: user.id || null,
        tags: { create: input.tagIds.map((tagId) => ({ tagId })) },
        userGroups: {
          create: input.userGroupIds.map((userGroupId) => ({ userGroupId })),
        },
      },
      include: APP_INCLUDE,
    })
    // TODO(auth): append an `app.created` row to audit_log (§3.2).
    return toAppResponse(app)
  }

  async update(id: string, input: UpdateAppDto): Promise<AppResponse> {
    await this.findOne(id)

    const app = await this.prisma.app.update({
      where: { id },
      data: {
        name: input.name,
        url: input.url,
        version: input.version,
        description: input.description,
        tagline: input.tagline,
        status:
          input.status === undefined ? undefined : toStatusEnum(input.status),
        ...(input.icon === undefined
          ? {}
          : {
              iconName: input.icon?.name ?? null,
              iconSizeLabel: input.icon?.sizeLabel ?? null,
              iconUrl: input.icon?.url ?? null,
            }),
        // Join rows are replaced wholesale, so a PATCH that omits them leaves
        // them alone and one that sends them is the new complete set.
        ...(input.tagIds === undefined
          ? {}
          : {
              tags: {
                deleteMany: {},
                create: input.tagIds.map((tagId) => ({ tagId })),
              },
            }),
        ...(input.userGroupIds === undefined
          ? {}
          : {
              userGroups: {
                deleteMany: {},
                create: input.userGroupIds.map((userGroupId) => ({
                  userGroupId,
                })),
              },
            }),
      },
      include: APP_INCLUDE,
    })
    // TODO(auth): append an `app.updated` row to audit_log (§3.2).
    return toAppResponse(app)
  }
}
