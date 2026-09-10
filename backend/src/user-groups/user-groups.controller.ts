import { Controller, Get } from '@nestjs/common'
import { UserGroupsService } from './user-groups.service'

@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly userGroups: UserGroupsService) {}

  @Get()
  list() {
    return this.userGroups.list()
  }
}
