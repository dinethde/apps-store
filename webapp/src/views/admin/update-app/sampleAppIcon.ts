import { SVG_MIME } from '../components/schemaUtils'

// Apps come back from the API without a real icon file, so the form is
// seeded with this placeholder to satisfy the required App Icon field
// until icon uploads are wired end to end.
const SAMPLE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="12" fill="#4C6FFF"/>
  <path d="M16 30V20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2Z" fill="#FFFFFF"/>
  <path d="M20 18v-2a4 4 0 0 1 8 0v2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
</svg>`

export const SAMPLE_ICON_FILE_NAME = 'sample-app-icon.svg'

export function createSampleAppIconFile() {
  return new File([SAMPLE_ICON_SVG], SAMPLE_ICON_FILE_NAME, {
    type: SVG_MIME,
  })
}
