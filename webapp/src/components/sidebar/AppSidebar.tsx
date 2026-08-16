import Logo from "@assets/logo.svg?react"
import LogoCollapsed from "@assets/logo-collapsed.svg?react"
import { SquareLibrary, ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "@tanstack/react-router";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar, } from '@/components/ui/sidebar';
import { SidebarToggle } from "./SidebarToggle";

function SidebarLogo() {
  const { state } = useSidebar();
  return state === 'collapsed' ? <LogoCollapsed className="w-8 h-8" /> : <Logo className=" " />;
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

        <SidebarGroup className="p-2">
          <hr className="neutral-border-main" />
        </SidebarGroup>

        <SidebarContent className="flex flex-col justify-between h-full">
          <SidebarGroup>
            <SidebarMenu className="sidebar-menu">
              <SidebarMenuItem className="sidebar-menu-item">
                <Link to="/" activeOptions={{ exact: true }}>
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive} className="!p-2 !cursor-pointer hover:!bg-nav_item-hover-bg data-active:!bg-nav_item-focussed-bg data-active:!text-nav_item-focussed-text h-fit">
                      <div className='flex gap-2 items-center w-full'>
                        <SquareLibrary />
                        <p className='p-m-medium w-full'>Store</p>
                        {isActive && <div className="w-1 h-5 bg-nav_item-focussed-text rounded-lg"></div>}
                      </div>
                    </SidebarMenuButton>
                  )}
                </Link>

              </SidebarMenuItem>

              <SidebarMenuItem className="sidebar-menu-item">
                <Link to="/profile">
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive} className="!p-2 !cursor-pointer hover:!bg-nav_item-hover-bg data-active:!bg-nav_item-focussed-bg data-active:!text-nav_item-focussed-text h-fit">
                      <div className='flex gap-2 items-center w-full'>
                        <SquareLibrary />
                        <p className='p-m-medium w-full'>Profile</p>
                        {isActive && <div className="w-1 h-5 bg-nav_item-focussed-text rounded-lg"></div>}
                      </div>
                    </SidebarMenuButton>
                  )}
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem className="sidebar-menu-item">
                <Link to="/admin">
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive} className="!p-2 !cursor-pointer hover:!bg-nav_item-hover-bg data-active:!bg-nav_item-focussed-bg data-active:!text-nav_item-focussed-text h-fit">
                      <div className='flex gap-2 items-center w-full'>
                        <SquareLibrary />
                        <p className='p-m-medium w-full'>Admin</p>
                        {isActive && <div className="w-1 h-5 bg-nav_item-focussed-text rounded-lg"></div>}
                      </div>
                    </SidebarMenuButton>
                  )}
                </Link>
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
                <Link to="/profile">
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive} className="!p-2 !cursor-pointer hover:!bg-nav_item-hover-bg data-active:!bg-nav_item-focussed-bg data-active:!text-nav_item-focussed-text h-fit">
                      <div className='flex gap-2 items-center w-full'>
                        <SquareLibrary />
                        <p className='p-m-medium w-full'>Help & Support</p>
                        {isActive && <div className="w-1 h-5 bg-nav_item-focussed-text rounded-lg"></div>}
                      </div>
                    </SidebarMenuButton>
                  )}
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarGroup className="p-2">
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
