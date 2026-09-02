import { BadRequestException } from '@nestjs/common'
import type { ValidationError } from 'class-validator'

/**
 * Turns class-validator's errors into §7.3's `details`:
 * `[{ "field": "url", "rule": "isUrl" }]`.
 */
export function validationExceptionFactory(errors: Array<ValidationError>) {
  return new BadRequestException({
    code: 'VALIDATION_FAILED',
    message: 'The request body failed validation.',
    details: flatten(errors),
  })
}

function flatten(
  errors: Array<ValidationError>,
  parent = '',
): Array<{ field: string; rule: string }> {
  return errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property
    return [
      ...Object.keys(error.constraints ?? {}).map((rule) => ({ field, rule })),
      ...flatten(error.children ?? [], field),
    ]
  })
}
