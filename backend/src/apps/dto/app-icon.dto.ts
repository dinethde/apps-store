import { IsString, MaxLength } from 'class-validator'

export class AppIconDto {
  @IsString()
  @MaxLength(255)
  name: string

  @IsString()
  @MaxLength(60)
  sizeLabel: string

  @IsString()
  @MaxLength(2048)
  url: string
}
