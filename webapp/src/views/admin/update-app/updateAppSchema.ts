import { z } from 'zod'
import { createAppFormSchema } from '../create-app/createAppSchema'

export function updateAppFormSchema(
  existingAppNames: Array<string>,
  currentName: string,
) {
  return createAppFormSchema(
    existingAppNames.filter(
      (n) => n.toLowerCase() !== currentName.toLowerCase(),
    ),
  ).extend({
    appId: z.string().min(1, 'Select an app to update'),
  })
}

export type UpdateAppFormValues = z.infer<
  ReturnType<typeof updateAppFormSchema>
>
