import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { AppsService } from './apps.service'
import { CreateAppDto } from './dto/create-app.dto'
import { UpdateAppDto } from './dto/update-app.dto'
import { ListAppsQueryDto } from './dto/list-apps-query.dto'

// TODO(auth): §7.2 splits the unfiltered admin list and the write endpoints
// into /admin/apps behind the editor role. Until there are roles to guard
// with, the catalog routes carry the writes the admin screens already call.
@Controller('apps')
export class AppsController {
  constructor(private readonly apps: AppsService) {}

  @Get()
  list(@Query() query: ListAppsQueryDto) {
    return this.apps.list(query)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.apps.findOne(id)
  }

  @Post()
  create(@Body() body: CreateAppDto) {
    return this.apps.create(body)
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateAppDto) {
    return this.apps.update(id, body)
  }
}
