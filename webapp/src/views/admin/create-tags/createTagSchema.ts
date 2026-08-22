import { z } from 'zod'
import { HEX_COLOR, nameUniqueRefinement } from '../components/schemaUtils'

export function createTagFormSchema(existingTagNames: Array<string>) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Tag Name must be at least 2 characters')
      .max(30, 'Tag Name must be under 30 characters')
      .refine(nameUniqueRefinement(existingTagNames), {
        message: 'A tag with this name already exists',
      }),
    color: z
      .string()
      .trim()
      .regex(HEX_COLOR, 'Enter a valid hex color, e.g. #FF5700'),
    status: z.boolean(),
  })
}

export type CreateTagFormValues = z.infer<
  ReturnType<typeof createTagFormSchema>
>
