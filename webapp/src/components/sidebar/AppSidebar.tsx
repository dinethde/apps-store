import Logo from "@assets/logo.svg?react"
import LogoCollapsed from "@assets/logo-collapsed.svg?react"
import { SquareLibrary, ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar, } from '@/components/ui/sidebar';
import { SidebarToggle } from "./SidebarToggle";

function SidebarLogo() {
  const { state } = useSidebar();
  return state === 'collapsed' ? <LogoCollapsed className="w-8 h-8" /> : <Logo className="" />;
}

export default function AppSidebar() {
  return (
    <SidebarProvider className="h-full">
      <Sidebar className='flex flex-col gap-3 bg-transparent border-none py-4' collapsible="icon">
        <SidebarHeader className="py-0">
          <SidebarMenuItem className="flex gap-2 items-center">
            <div className="w-full">
              <SidebarLogo />
            </div>
            <SidebarToggle className="group-data-[collapsible=icon]:hidden" />
          </SidebarMenuItem>
        </SidebarHeader>

        <SidebarGroup className="sidebar-group">
          <hr className="neutral-border-main" />
        </SidebarGroup>

        <SidebarContent className="flex flex-col justify-between h-full">
          <SidebarGroup>
            <SidebarMenu className="sidebar-menu">
              <SidebarMenuItem className="sidebar-menu-item">
                <SidebarMenuButton >
                  <a href="/" className='sidebar-link'>
                    <SquareLibrary />
                    <p className='p-m-medium'>Store</p>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="sidebar-menu-item">
                <SidebarMenuButton>
                  <a href="/profile" className='sidebar-link'>
                    <SquareLibrary />
                    <p className='p-m-medium'>Profile</p>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>


              <SidebarMenuItem className="sidebar-menu-item">
                <SidebarMenuButton>
                  <a href="/admin" className='sidebar-link'>
                    <SquareLibrary />
                    <p className='p-m-medium'>Admin</p>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarMenu className="sidebar-menu text-txt-primary-p2-active">
              <SidebarMenuItem className="sidebar-menu-item bg-transparent cursor-pointer">
                <SidebarMenuButton>
                  <SidebarToggle className="bg-transparent shadow-none p-0" />
                  <p className="p-m-medium">Collapsed</p>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="sidebar-menu-item">
                <SidebarMenuButton>
                  <SquareLibrary />
                  <p className='p-m-medium whitespace-nowrap'>Help & Support</p>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarGroup className="sidebar-group">
          <hr className="neutral-border-main" />
        </SidebarGroup>

        <SidebarFooter className="py-0">
          <SidebarGroup>
            <SidebarMenuItem>
              <div className="flex gap-2 items-center justify-content ">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="w-full group-data-[collapsible=icon]:hidden">
                  <p className="p-m-medium">Dineth</p>
                  <p className="p-s-medium">dinethdsilva@gmail.com</p>
                </div>

                <button className="group-data-[collapsible=icon]:hidden">
                  <ChevronsUpDown />
                </button>
              </div>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
