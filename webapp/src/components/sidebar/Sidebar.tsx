import Logo from "@assets/logo.svg?react"
import { SquareLibrary } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, } from '@/components/ui/sidebar';
import { SidebarToggle } from "./SidebarToggle";

export default function AppSidebar() {
  return (
    <div>
      <SidebarProvider>
        <Sidebar className='bg-transparent border-none py-1' collapsible="icon">
          <SidebarHeader>
            <SidebarMenuItem className="flex gap-2 items-center">
              <div className="">
                <Logo className="!w-7 !h-7 group-data-[collapsible=icon]:!w-8" />
              </div>

              <p className="h4 w-full whitespace-nowrap group-data-[collapsible=icon]:hidden">App Name</p>

              <SidebarToggle className="group-data-[collapsible=icon]:hidden" />
            </SidebarMenuItem>
          </SidebarHeader>

          <SidebarGroup className="sidebar-group">
            <hr className="border-1 border-border-territory-light-active w-full" />
          </SidebarGroup>

          <SidebarContent className="flex flex-col justify-between h-full">
            <SidebarGroup className="text-primary-p2-active">
              <SidebarMenu>
                <SidebarMenuItem className="sidebar-menu-item">
                  <SidebarMenuButton >
                    <a href="/home" className='sidebar-link'>
                      <SquareLibrary />
                      <p className='p-m-medium'>Store</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem className="sidebar-menu-item">
                  <SidebarMenuButton>
                    <a href="/home" className='sidebar-link'>
                      <SquareLibrary />
                      <p className='p-m-medium'>Personal</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>


                <SidebarMenuItem className="sidebar-menu-item">
                  <SidebarMenuButton>
                    <a href="/home" className='sidebar-link'>
                      <SquareLibrary />
                      <p className='p-m-medium'>Admin</p>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarMenu className="text-primary-p2-active">
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
            <hr className="border-1 border-border-territory-light-active w-full" />
          </SidebarGroup>

          <SidebarFooter>
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
    </div>
  )
}
