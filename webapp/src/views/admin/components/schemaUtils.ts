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

export const HEX_COLOR = /^#([0-9a-fA-F]{6})$/
export const SEMVER = /^\d+\.\d+\.\d+$/

export function nameUniqueRefinement(
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
