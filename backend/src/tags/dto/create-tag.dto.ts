import {
  IsBoolean,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export class CreateTagDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string

  // §3.2 wants a design-token name here; the frontend validates a hex code and
  // the mock data is hex, so hex is what the column holds today.
  @IsString()
  @Matches(HEX_COLOR, { message: 'color must be a hex code, e.g. #FF5700' })
  color: string

  @IsBoolean()
  status: boolean
}
