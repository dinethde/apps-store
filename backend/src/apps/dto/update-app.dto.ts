import { PartialType } from '@nestjs/mapped-types'
import { CreateAppDto } from './create-app.dto'

/** §7.1: PATCH is a partial update — every field is optional. */
export class UpdateAppDto extends PartialType(CreateAppDto) {}
