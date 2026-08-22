import { z } from 'zod'
import { createTagFormSchema } from '../create-tags/createTagSchema'

export function updateTagFormSchema(
  existingTagNames: Array<string>,
  currentName: string,
) {
  return createTagFormSchema(
    existingTagNames.filter(
      (n) => n.toLowerCase() !== currentName.toLowerCase(),
    ),
  ).extend({
    tagId: z.string().min(1, 'Select a tag to update'),
  })
}

export type UpdateTagFormValues = z.infer<
  ReturnType<typeof updateTagFormSchema>
>
