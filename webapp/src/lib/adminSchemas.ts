import { z } from 'zod'

const SVG_MIME = 'image/svg+xml'
const MAX_ICON_BYTES = 5 * 1024 * 1024

export const appIconSchema = z
  .instanceof(File)
  .refine((file) => file.type === SVG_MIME || file.name.endsWith('.svg'), {
    message: 'Only svgs are allowed',
  })
  .refine((file) => file.size <= MAX_ICON_BYTES, {
    message: 'Max file size is 5mbs',
  })
  .nullable()

const HEX_COLOR = /^#([0-9a-fA-F]{6})$/
const SEMVER = /^\d+\.\d+\.\d+$/

function nameUniqueRefinement(
  existingNames: Array<string>,
  ignoreName?: string,
) {
  const taken = new Set(
    existingNames
      .filter((n) => n.toLowerCase() !== (ignoreName ?? '').toLowerCase())
      .map((n) => n.toLowerCase()),
  )
  return (value: string) => !taken.has(value.trim().toLowerCase())
}

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

export type CreateAppFormValues = z.infer<
  ReturnType<typeof createAppFormSchema>
>
export type UpdateAppFormValues = z.infer<
  ReturnType<typeof updateAppFormSchema>
>

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

export type CreateTagFormValues = z.infer<
  ReturnType<typeof createTagFormSchema>
>
export type UpdateTagFormValues = z.infer<
  ReturnType<typeof updateTagFormSchema>
>
