import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { listEnvelope } from '../common/list-envelope'
import type { Tag } from '@prisma/client'
import type { ListEnvelope } from '../common/list-envelope'
import type { CreateTagDto } from './dto/create-tag.dto'
import type { UpdateTagDto } from './dto/update-tag.dto'

/** Exactly `Tag` in webapp/src/types/admin.ts. */
export type TagResponse = {
  id: string
  name: string
  color: string
  status: boolean
}

function toTagResponse(tag: Tag): TagResponse {
  return { id: tag.id, name: tag.name, color: tag.color, status: tag.isActive }
}

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Unpaged: the tag picker needs every tag at once.
   *
   * TODO(auth): §7.2 has this return active tags only. It cannot yet, because
   * the admin screens read the same list and an inactive tag has to stay
   * editable. The filter belongs on the catalog list once /admin/tags exists.
   */
  async list(): Promise<ListEnvelope<TagResponse>> {
    const tags = await this.prisma.tag.findMany({ orderBy: { name: 'asc' } })
    return listEnvelope(tags.map(toTagResponse), {
      page: 1,
      pageSize: tags.length,
      total: tags.length,
    })
  }

  async create(input: CreateTagDto): Promise<TagResponse> {
    const tag = await this.prisma.tag.create({
      data: { name: input.name, color: input.color, isActive: input.status },
    })
    return toTagResponse(tag)
  }

  async update(id: string, input: UpdateTagDto): Promise<TagResponse> {
    const existing = await this.prisma.tag.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('No tag with that id.')

    const tag = await this.prisma.tag.update({
      where: { id },
      data: { name: input.name, color: input.color, isActive: input.status },
    })
    return toTagResponse(tag)
  }
}
