import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { listEnvelope } from '../common/list-envelope'
import type { ListEnvelope } from '../common/list-envelope'

/** Exactly `UserGroup` in webapp/src/types/admin.ts. */
export type UserGroupResponse = { id: string; name: string }

@Injectable()
export class UserGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Read-only: §2.2 puts membership in Keycloak and this table is a mirror
   * the sync job owns. TODO(auth): GroupSyncService (§6.8) writes it.
   */
  async list(): Promise<ListEnvelope<UserGroupResponse>> {
    const groups = await this.prisma.userGroup.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    })
    return listEnvelope(groups, {
      page: 1,
      pageSize: groups.length,
      total: groups.length,
    })
  }
}
