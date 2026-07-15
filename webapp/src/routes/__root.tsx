import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ArrowLeftToLine } from 'lucide-react';
import Logo from "@assets/logo.svg?react"
import { SquareLibrary } from 'lucide-react';


import appCss from '../styles.css?url'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';

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
    <div className='w-full h-full h-screen bg-surface-secondary-main-active flex flex-row'>
      <div className='flex flex-row gap-4 justify-start items-center w-56'>
        <SidebarProvider>
          <Sidebar className='bg-transparent border-none'>
            <SidebarHeader>
              <SidebarMenuItem>
                <SidebarMenuButton className='px-0 w-fit w-full !h-auto'>

                  <Logo className='!w-7 !h-7' />

                  <p className='h4 w-full'>App Name</p>

                  <div className='px-2 py-1 bg-surface-primary-light-active rounded-sm shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]'>
                    <ArrowLeftToLine className='' />
                  </div>

                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton >
                    <a href="/home" className='sidebar-link'>
                      <SquareLibrary />
                      <p className='p-m-medium'>Store</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <a href="/home" className='sidebar-link'>
                      <SquareLibrary />
                      <p className='p-m-medium'>Personal</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>


                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <a href="/home" className='sidebar-link'>
                      <SquareLibrary />
                      <p className='p-m-medium'>Admin</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
        </SidebarProvider>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  )
}
