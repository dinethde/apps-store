import { expect, test } from '@playwright/test'
import {
  CHIP_SPECS,
  FIGMA_COLORS,
  HOVER_SPECS,
  REMOVE_ICON,
} from './figma-chip-spec'
import type { Locator } from '@playwright/test'

/** Served by the Vite dev server, which transforms it on request. */
const FIXTURE_MODULE = '/testing/fixtures/mount-chips.tsx'

/**
 * Measures every Chip variant rendered by the /dev/chips gallery against the
 * values transcribed from Figma node 596:7822.
 */

function styleOf(chip: Locator, property: string) {
  return chip.evaluate(
    (el, prop) => getComputedStyle(el).getPropertyValue(prop),
    property,
  )
}

/**
 * The gallery is mounted into the running app rather than served by a route of
 * its own, so the chips are measured against the real compiled Tailwind theme
 * without the application carrying a page it does not need. See
 * ./fixtures/mount-chips.tsx.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/')

  // React hydrates <body> itself, and tears out any child it did not render.
  // A host appended before hydration settles therefore disappears again, so
  // wait for React to attach to the body, then confirm the mount survives a
  // couple of frames before trusting it.
  await page.waitForFunction(() =>
    Object.keys(document.body).some((key) => key.startsWith('__reactFiber$')),
  )

  await expect(async () => {
    await page.evaluate(async (modulePath) => {
      // Passed in rather than inlined so TypeScript treats it as a runtime URL
      // for the dev server to resolve, not a module to look up on disk.
      const fixture = (await import(modulePath)) as {
        mountChipGallery: () => void
      }

      fixture.mountChipGallery()
      await new Promise(requestAnimationFrame)
      await new Promise(requestAnimationFrame)
    }, FIXTURE_MODULE)

    await expect(page.getByTestId('chip-gallery')).toBeVisible({
      timeout: 1_000,
    })
  }).toPass({ timeout: 15_000 })

  // Inter is loaded from a remote stylesheet; metrics are wrong until it lands.
  await page.evaluate(() => document.fonts.ready)
})

for (const spec of CHIP_SPECS) {
  test.describe(`${spec.variant} chip (Figma ${spec.figmaVariant}, ${spec.figmaNodeId})`, () => {
    test('renders its label', async ({ page }) => {
      await expect(page.getByTestId(spec.testId)).toHaveText(
        new RegExp(spec.label),
      )
    })

    test('matches the Figma fill, border and radius', async ({ page }) => {
      const chip = page.getByTestId(spec.testId)

      expect(await styleOf(chip, 'background-color')).toBe(spec.backgroundColor)
      expect(await styleOf(chip, 'border-top-width')).toBe(spec.borderWidth)
      expect(await styleOf(chip, 'border-top-left-radius')).toBe(
        spec.borderRadius,
      )

      if (spec.borderWidth !== '0px') {
        expect(await styleOf(chip, 'border-top-color')).toBe(spec.borderColor)
      }
    })

    test('matches the Figma padding', async ({ page }) => {
      const chip = page.getByTestId(spec.testId)
      const padding = await chip.evaluate((el) => {
        const s = getComputedStyle(el)
        return `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`
      })

      expect(padding).toBe(spec.padding)
    })

    test('matches the Figma type style', async ({ page }) => {
      const chip = page.getByTestId(spec.testId)

      expect(await styleOf(chip, 'font-size')).toBe(spec.fontSize)
      expect(await styleOf(chip, 'font-weight')).toBe(spec.fontWeight)
      expect(await styleOf(chip, 'letter-spacing')).toBe(spec.letterSpacing)
      expect(await styleOf(chip, 'color')).toBe(spec.color)
    })

    if (spec.gap) {
      test('matches the Figma gap', async ({ page }) => {
        expect(await styleOf(page.getByTestId(spec.testId), 'column-gap')).toBe(
          spec.gap,
        )
      })
    }
  })
}

for (const spec of HOVER_SPECS) {
  test(`${spec.testId} adopts Figma ${spec.figmaVariant} (${spec.figmaNodeId}) on hover`, async ({
    page,
  }) => {
    const chip = page.getByTestId(spec.testId)

    await chip.hover()
    expect(await styleOf(chip, 'background-color')).toBe(spec.expected)
  })
}

test.describe('removable chip', () => {
  test('draws the cross in the p2 text colour, larger than the design', async ({
    page,
  }) => {
    const icon = page.getByTestId('chip-solid-removable').locator('svg')
    const box = await icon.boundingBox()

    expect(box?.width).toBeCloseTo(REMOVE_ICON.size, 1)
    expect(box?.height).toBeCloseTo(REMOVE_ICON.size, 1)
    expect(await icon.evaluate((el) => getComputedStyle(el).stroke)).toBe(
      FIGMA_COLORS.textNeutralP2Active,
    )
  })

  test('exposes an accessible remove control', async ({ page }) => {
    await expect(
      page.getByTestId('chip-solid-removable').getByRole('button', {
        name: 'Remove Tag',
      }),
    ).toBeVisible()
  })

  test('is the only variant with a remove control', async ({ page }) => {
    for (const spec of CHIP_SPECS.filter(
      (s) => s.testId !== 'chip-solid-removable',
    )) {
      await expect(
        page.getByTestId(spec.testId).getByRole('button'),
      ).toHaveCount(0)
    }
  })
})

test.describe('overall geometry', () => {
  /**
   * Figma reports each variant's frame size with its own auto text-height
   * measurement, which differs from CSS line-height by a pixel or so. Widths
   * are the meaningful check, so heights get a 2px tolerance.
   */
  const FRAMES = [
    { testId: 'chip-pill', width: 87, height: 24 },
    { testId: 'chip-solid', width: 34, height: 22 },
  ]

  for (const frame of FRAMES) {
    test(`${frame.testId} is close to its ${frame.width}x${frame.height} Figma frame`, async ({
      page,
    }) => {
      const box = await page.getByTestId(frame.testId).boundingBox()

      expect(box?.width).toBeGreaterThan(frame.width - 2)
      expect(box?.width).toBeLessThan(frame.width + 2)
      expect(box?.height).toBeGreaterThan(frame.height - 2)
      expect(box?.height).toBeLessThan(frame.height + 2)
    })
  }
})

test('the removable chip is only as wide as its larger cross requires', async ({
  page,
}) => {
  const plain = await page.getByTestId('chip-solid').boundingBox()
  const removable = await page.getByTestId('chip-solid-removable').boundingBox()

  // Figma's 44px frame assumes its 6px cross; the rest of the box is unchanged.
  const gap = 4
  expect(removable!.width - plain!.width).toBeCloseTo(gap + REMOVE_ICON.size, 1)
  expect(removable!.height).toBeCloseTo(plain!.height, 1)
})

test('the gallery matches its visual baseline', async ({ page }) => {
  await expect(page.getByTestId('chip-gallery')).toHaveScreenshot(
    'chip-variants.png',
  )
})
