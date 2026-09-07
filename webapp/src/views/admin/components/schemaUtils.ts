export const SVG_MIME = 'image/svg+xml'
export const MAX_ICON_BYTES = 5 * 1024 * 1024

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
