import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * The design tokens name font sizes `p-s-medium`, `h3`, … and text colours
 * `txt-neutral-p2-active`, … so `text-p-s-medium` and
 * `text-txt-neutral-p2-active` look identical to tailwind-merge's default
 * parser: it files both under `text-color` and silently drops the earlier one.
 * Registering the font-size token names splits them back into two groups.
 *
 * Keep this list in sync with the `--text-*` entries in
 * `src/styles/design-tokens.css`.
 */
const FONT_SIZE_TOKENS = [
  'h1',
  'h1-medium',
  'h2',
  'h2-medium',
  'h3',
  'h3-medium',
  'h4',
  'h4-medium',
  'h5',
  'h5-medium',
  'p',
  'p-medium',
  'p-m',
  'p-m-medium',
  'p-s',
  'p-s-medium',
  'p-xs',
  'p-xs-medium',
]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: FONT_SIZE_TOKENS }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
