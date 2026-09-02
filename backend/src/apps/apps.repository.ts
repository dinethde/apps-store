import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { APP_INCLUDE } from './app.mapper'
import type { CurrentUser } from '../common/current-user.service'
import type { AppWithRelations } from './app.mapper'

/**
 * Every read goes through `visibleWhere`, so §5.5's visibility rule has one
 * place to live when auth arrives.
 */
@Injectable()
export class AppsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * TODO(auth): §5.5 — an app is visible when it is not soft-deleted, and its
   * status is PUBLISHED, and either it has no app_user_groups rows or one of
   * them is in the caller's groups; an admin sees every non-deleted app. With
   * no token to read groups from, only the soft-delete half applies today.
   */
  visibleWhere(_user: CurrentUser): Prisma.AppWhereInput {
    return { deletedAt: null }
  }

  findMany(
    where: Prisma.AppWhereInput,
    page: number,
    pageSize: number,
  ): Promise<[Array<AppWithRelations>, number]> {
    return this.prisma.$transaction([
      this.prisma.app.findMany({
        where,
        include: APP_INCLUDE,
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.app.count({ where }),
    ])
  }

  findOne(where: Prisma.AppWhereInput): Promise<AppWithRelations | null> {
    return this.prisma.app.findFirst({ where, include: APP_INCLUDE })
  }
}
