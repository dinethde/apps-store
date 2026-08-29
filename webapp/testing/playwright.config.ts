import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

/**
 * The suite drives the real Vite dev server so the chips are measured with the
 * app's compiled Tailwind theme rather than a stand-in stylesheet. Both the
 * dev server and the Mockoon API are reused when they are already running.
 */
export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'line' : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    // Chip sizing is asserted to a tenth of a pixel, so pin the scale factor.
    deviceScaleFactor: 1,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : [
        {
          command: 'bun run mock',
          url: 'http://localhost:3001/apps',
          cwd: '..',
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          command: 'bun run dev',
          url: BASE_URL,
          cwd: '..',
          reuseExistingServer: true,
          timeout: 120_000,
        },
      ],
})
