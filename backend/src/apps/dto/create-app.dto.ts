import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { AppIconDto } from './app-icon.dto'

const SEMVER = /^\d+\.\d+\.\d+$/

export class CreateAppDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name: string

  @IsUrl({ require_protocol: true })
  url: string

  @IsString()
  @Matches(SEMVER, { message: 'version must be semantic, e.g. 1.0.0' })
  version: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string

  @IsString()
  @MaxLength(100)
  tagline: string

  @IsArray()
  @IsUUID(undefined, { each: true })
  tagIds: Array<string>

  @IsArray()
  @IsUUID(undefined, { each: true })
  userGroupIds: Array<string>

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AppIconDto)
  icon: AppIconDto | null = null

  @IsBoolean()
  status: boolean
}
