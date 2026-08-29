import { expect, test } from '@playwright/test'
import { FIGMA_COLORS } from './figma-chip-spec'

/**
 * Chip's real call site: the user-group section of the home filter popover,
 * which used to hold a local GroupChip. These tests guard the move rather than
 * the design, so they only assert what the popover actually depends on.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Filter apps' }).click()
  await expect(page.getByRole('heading', { name: 'Filters' })).toBeVisible()
})

test('renders user groups as solid chips', async ({ page }) => {
  const chips = page.locator('[data-slot="chip"]')

  await expect(chips.first()).toBeVisible()

  const background = await chips
    .first()
    .evaluate((el) => getComputedStyle(el).backgroundColor)

  expect(background).toBe(FIGMA_COLORS.surfaceNeutralMainHover)
})

test('a selected user group chip can be removed again', async ({ page }) => {
  const chips = page.locator('[data-slot="chip"]')
  const label = (await chips.first().innerText()).trim()

  await chips.first().click()

  const removeButton = page.getByRole('button', { name: `Remove ${label}` })
  await expect(removeButton).toBeVisible()

  await removeButton.click()
  await expect(removeButton).toHaveCount(0)
})
