import { z } from 'zod'
import {
  appIconSchema,
  nameUniqueRefinement,
  SEMVER,
} from '../components/schemaUtils'

export function createAppFormSchema(existingAppNames: Array<string>) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, 'App Name must be at least 2 characters')
      .max(60, 'App Name must be under 60 characters')
      .refine(nameUniqueRefinement(existingAppNames), {
        message: 'An app with this name already exists',
      }),
    url: z
      .string()
      .trim()
      .min(1, 'App URL is required')
      .url('Enter a valid URL, e.g. https://example.com'),
    version: z
      .string()
      .trim()
      .min(1, 'App Version is required')
      .regex(SEMVER, 'Use semantic versioning, e.g. 1.0.0'),
    description: z
      .string()
      .trim()
      .min(10, 'App Description must be at least 10 characters')
      .max(500, 'App Description must be under 500 characters'),
    tagline: z
      .string()
      .trim()
      .max(100, 'Tagline must be under 100 characters')
      .optional()
      .or(z.literal('')),
    tagIds: z.array(z.string()).min(1, 'Select at least one tag'),
    userGroupIds: z.array(z.string()),
    icon: appIconSchema,
    status: z.boolean(),
  })
}

export type CreateAppFormValues = z.infer<
  ReturnType<typeof createAppFormSchema>
>
