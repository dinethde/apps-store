import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

/**
 * The one place the caller's identity is resolved. This pass has no auth
 * (deliberately — see the backend README), so it returns the seeded dev user.
 *
 * TODO(auth): resolve `{ id, sub, role, groupIds }` from the verified token
 * per architecture §6.7 and drop the seeded fallback. Nothing else in the
 * codebase assumes who the caller is, so this function is the whole change.
 */
export const DEV_USER_SUBJECT = 'dev-user'

export type CurrentUser = {
  id: string
  isAdmin: boolean
  groupIds: Array<string>
}

@Injectable()
export class CurrentUserService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<CurrentUser> {
    const user = await this.prisma.user.findUnique({
      where: { idpSubject: DEV_USER_SUBJECT },
      select: { id: true },
    })

    // Without auth every caller is the dev user, and the dev user sees
    // everything. Both halves go away with the token.
    return { id: user?.id ?? '', isAdmin: true, groupIds: [] }
  }
}
