import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

/** §7.4: `page` (default 1), `pageSize` (default 24, max 100), `q`. */
export class ListAppsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 24

  @IsOptional()
  @IsString()
  q?: string
}
