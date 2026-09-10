import { createRoot } from 'react-dom/client'
import { Chip } from '@/components/Chip'

/**
 * Mounts every Chip variant so the Playwright suite has something to measure.
 *
 * Only the solid variant appears anywhere in the app, and the other two are
 * not worth a route of their own, so the specs import this module through the
 * Vite dev server and call it against the already-loaded page. That keeps the
 * gallery out of the application entirely at the cost of tying the suite to
 * the dev server — these tests cannot run against a production build.
 */
const SPECIMENS = [
  { variant: 'pill', label: 'Favourites', removable: false },
  { variant: 'outline', label: 'wso2-everyone', removable: false },
  { variant: 'solid', label: 'Tag', removable: true },
  { variant: 'solid', label: 'Tag', removable: false },
] as const

const HOST_ID = 'chip-gallery-host'

export function mountChipGallery() {
  document.getElementById(HOST_ID)?.remove()

  const host = document.createElement('div')
  host.id = HOST_ID
  host.dataset.testid = 'chip-gallery'
  // Sits over the app so screenshots capture the chips on a clean ground
  // rather than whatever the underlying route happened to render.
  host.style.cssText = `position: fixed; top: 0; left: 0; z-index: 9999;
    display: flex; flex-direction: column; align-items: flex-start; gap: 16px;
    padding: 16px; background: #ffffff;`
  document.body.append(host)

  createRoot(host).render(
    <>
      {SPECIMENS.map((specimen) => (
        <Chip
          key={`${specimen.variant}-${String(specimen.removable)}`}
          data-testid={`chip-${specimen.variant}${specimen.removable ? '-removable' : ''}`}
          variant={specimen.variant}
          label={specimen.label}
          onRemove={specimen.removable ? () => {} : undefined}
        />
      ))}
    </>,
  )
}
