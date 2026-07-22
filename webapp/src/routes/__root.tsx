import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import appCss from '../styles.css?url'
import AppSidebar from '@/components/sidebar/AppSidebar'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown } from 'lucide-react';

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
  component: RootComponent
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
    <div className='w-full h-full h-screen bg-surface-secondary-main-active flex flex-row gap-1'>
      <div className='flex flex-row gap-4 justify-start items-center'>
        <AppSidebar />
      </div>

      <div className="py-2 w-full">
        <div className='w-full'>
          <div className='flex justify-between items-center'>
            <div className='flex flex-col gap-1'>
              <p className='text-primary-p4-active p-s'>
                Apps Store
              </p>

              <p className='h3 text-primary-p1-active'>
                Welcome back, Dineth
              </p>
            </div>

            <div>
              <div className="flex gap-2 items-center justify-content ">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="w-full group-data-[collapsible=icon]:hidden">
                  <p className="p-m-medium text-primary-p2-active">Dineth</p>
                  <p className="p-s text-primary-p3-active">Software Engineer</p>
                </div>
              </div>
            </div>

          </div>
          <Outlet />
        </div>
      </div>
    </div >
  )
}

