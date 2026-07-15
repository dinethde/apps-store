import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ArrowLeftToLine } from 'lucide-react';
import Logo from "@assets/logo.svg?react"
import { SquareLibrary } from 'lucide-react';
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown } from 'lucide-react';


import appCss from '../styles.css?url'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, } from '@/components/ui/sidebar';

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
      <div className='flex flex-row gap-4 justify-start items-center'>
        <SidebarProvider>
          <Sidebar className='bg-transparent border-none' collapsible="icon">
            <SidebarHeader>
              <SidebarMenuItem>
                <SidebarMenuButton className="!px-0 !h-auto w-full group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!size-auto group-data-[collapsible=icon]:justify-center">
                  <div className="group-data-[collapsible=icon]:mx-auto">
                    <Logo className="!w-7 !h-7 group-data-[collapsible=icon]:!w-8" />
                  </div>
                  <p className="h4 w-full whitespace-nowrap group-data-[collapsible=icon]:hidden">App Name</p>
                  <CustomTrigger className="group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <hr className="border-1 border-border-territory-light-active" />
              </SidebarGroup>

              <SidebarGroup className="text-primary-p2-active">
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
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu className="text-primary-p2-active">

                <SidebarGroup>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <SquareLibrary />
                      <p className='p-m-medium'>Collapse</p>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <SquareLibrary />
                      <p className='p-m-medium'>Help & Support</p>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarMenuItem>
                    <hr className="border-1 border-border-territory-light-active" />
                  </SidebarMenuItem>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <div className="flex gap-2 items-center justify-content ">
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div className="w-full">
                          <p className="p-m-medium">Dineth</p>
                          <p className="p-s-medium">dinethdsilva@gmail.com</p>
                        </div>

                        <button>
                          <ChevronsUpDown />
                        </button>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarGroup>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </div>

      <div>
        <Outlet />
      </div>
    </div >
  )
}

export function CustomTrigger({ className = '' }: { className?: string }) {
  const { toggleSidebar } = useSidebar()

  const handleClick = () => {
    setTimeout(() => {
      toggleSidebar()
    }, 0)
  }

  return (
    <div className={cn('px-2 py-1 bg-surface-primary-light-active rounded-sm shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]', className)} onClick={handleClick}>
      <ArrowLeftToLine className='' />
    </div>
  )
}
