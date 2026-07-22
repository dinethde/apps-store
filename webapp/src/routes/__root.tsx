import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import appCss from '../styles.css?url'

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
        {/*   <SidebarProvider> */}
        {/*     <Sidebar className='bg-transparent border-none py-1' collapsible="icon"> */}
        {/*       <SidebarHeader> */}
        {/*         <SidebarMenuItem className="flex gap-2 items-center"> */}
        {/*           <div className=""> */}
        {/*             <Logo className="!w-7 !h-7 group-data-[collapsible=icon]:!w-8" /> */}
        {/*           </div> */}
        {/**/}
        {/*           <p className="h4 w-full whitespace-nowrap group-data-[collapsible=icon]:hidden">App Name</p> */}
        {/**/}
        {/*           <CustomTrigger className="group-data-[collapsible=icon]:hidden" /> */}
        {/*         </SidebarMenuItem> */}
        {/*       </SidebarHeader> */}
        {/**/}
        {/*       <SidebarGroup className="sidebar-group"> */}
        {/*         <hr className="border-1 border-border-territory-light-active w-full" /> */}
        {/*       </SidebarGroup> */}
        {/**/}
        {/*       <SidebarContent className="flex flex-col justify-between h-full"> */}
        {/*         <SidebarGroup className="text-primary-p2-active"> */}
        {/*           <SidebarMenu> */}
        {/*             <SidebarMenuItem className="sidebar-menu-item"> */}
        {/*               <SidebarMenuButton > */}
        {/*                 <a href="/home" className='sidebar-link'> */}
        {/*                   <SquareLibrary /> */}
        {/*                   <p className='p-m-medium'>Store</p> */}
        {/*                 </a> */}
        {/*               </SidebarMenuButton> */}
        {/*             </SidebarMenuItem> */}
        {/**/}
        {/*             <SidebarMenuItem className="sidebar-menu-item"> */}
        {/*               <SidebarMenuButton> */}
        {/*                 <a href="/home" className='sidebar-link'> */}
        {/*                   <SquareLibrary /> */}
        {/*                   <p className='p-m-medium'>Personal</p> */}
        {/*                 </a> */}
        {/*               </SidebarMenuButton> */}
        {/*             </SidebarMenuItem> */}
        {/**/}
        {/**/}
        {/*             <SidebarMenuItem className="sidebar-menu-item"> */}
        {/*               <SidebarMenuButton> */}
        {/*                 <a href="/home" className='sidebar-link'> */}
        {/*                   <SquareLibrary /> */}
        {/*                   <p className='p-m-medium'>Admin</p> */}
        {/*                 </a> */}
        {/*               </SidebarMenuButton> */}
        {/*             </SidebarMenuItem> */}
        {/*           </SidebarMenu> */}
        {/*         </SidebarGroup> */}
        {/**/}
        {/*         <SidebarGroup> */}
        {/*           <SidebarMenu className="text-primary-p2-active"> */}
        {/*             <SidebarMenuItem className="sidebar-menu-item bg-transparent cursor-pointer"> */}
        {/*               <SidebarMenuButton> */}
        {/*                 <CustomTrigger className="bg-transparent shadow-none p-0" /> */}
        {/*                 <p className="p-m-medium">Collapsed</p> */}
        {/*               </SidebarMenuButton> */}
        {/*             </SidebarMenuItem> */}
        {/**/}
        {/*             <SidebarMenuItem className="sidebar-menu-item"> */}
        {/*               <SidebarMenuButton> */}
        {/*                 <SquareLibrary /> */}
        {/*                 <p className='p-m-medium whitespace-nowrap'>Help & Support</p> */}
        {/*               </SidebarMenuButton> */}
        {/*             </SidebarMenuItem> */}
        {/*           </SidebarMenu> */}
        {/*         </SidebarGroup> */}
        {/*       </SidebarContent> */}
        {/**/}
        {/*       <SidebarGroup className="sidebar-group"> */}
        {/*         <hr className="border-1 border-border-territory-light-active w-full" /> */}
        {/*       </SidebarGroup> */}
        {/**/}
        {/*       <SidebarFooter> */}
        {/*         <SidebarGroup> */}
        {/*           <SidebarMenuItem> */}
        {/*             <div className="flex gap-2 items-center justify-content "> */}
        {/*               <Avatar> */}
        {/*                 <AvatarImage src="https://github.com/shadcn.png" /> */}
        {/*                 <AvatarFallback>CN</AvatarFallback> */}
        {/*               </Avatar> */}
        {/**/}
        {/*               <div className="w-full group-data-[collapsible=icon]:hidden"> */}
        {/*                 <p className="p-m-medium">Dineth</p> */}
        {/*                 <p className="p-s-medium">dinethdsilva@gmail.com</p> */}
        {/*               </div> */}
        {/**/}
        {/*               <button className="group-data-[collapsible=icon]:hidden"> */}
        {/*                 <ChevronsUpDown /> */}
        {/*               </button> */}
        {/*             </div> */}
        {/*           </SidebarMenuItem> */}
        {/*         </SidebarGroup> */}
        {/*       </SidebarFooter> */}
        {/*     </Sidebar> */}
        {/*   </SidebarProvider> */}
      </div>

      <div>
        <Outlet />
      </div>
    </div >
  )
}

