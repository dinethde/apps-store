import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import appCss from '../styles.css?url'
import AppSidebar from '@/components/sidebar/AppSidebar'
import Header from '@/components/header/Header'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <div className="w-full h-full h-screen bg-surface-secondary-main-active flex flex-row gap-1">
      <div className="flex flex-row gap-4 justify-start items-center">
        <AppSidebar />
      </div>

      <div className="py-2 pr-2 w-full">
        <div className="w-full bg-surface-neutral-main-active rounded-[20px] overflow-hidden h-full border-1 border-outline-neutral-light-active">
          <Header />
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
