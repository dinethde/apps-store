import Logo from '@assets/logo.svg?react'
import LogoCollapsed from '@assets/logo-collapsed.svg?react'
import { SquareLibrary, ChevronsUpDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@tanstack/react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import { SidebarToggle } from './SidebarToggle'

function SidebarLogo() {
  const { state } = useSidebar()
  return state === 'collapsed' ? (
    <LogoCollapsed className="h-8 w-8" />
  ) : (
    <Logo className="" />
  )
}

export default function AppSidebar() {
  return (
    <SidebarProvider className="h-full">
      <Sidebar
        className="flex flex-col gap-3 border-none bg-transparent py-4"
        collapsible="icon"
      >
        <SidebarHeader className="py-0">
          <SidebarMenuItem className="flex items-center gap-2">
            <div className="w-full">
              <SidebarLogo />
            </div>
            <SidebarToggle className="group-data-[collapsible=icon]:hidden" />
          </SidebarMenuItem>
        </SidebarHeader>

        <SidebarGroup className="p-2">
          <hr className="neutral-border-main" />
        </SidebarGroup>

        <SidebarContent className="flex h-full flex-col justify-between">
          <SidebarGroup>
            <SidebarMenu className="sidebar-menu">
              <SidebarMenuItem className="sidebar-menu-item">
                <Link to="/" activeOptions={{ exact: true }}>
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`h-fit !cursor-pointer !p-2
                      hover:!bg-nav_item-hover-bg
                      data-active:!bg-nav_item-focussed-bg
                      data-active:!text-nav_item-focussed-text`}
                    >
                      <div className="flex w-full items-center gap-2">
                        <SquareLibrary />
                        <p className="p-m-medium w-full">Store</p>
                        {isActive && (
                          <div
                            className={`h-5 w-1 rounded-lg
                            bg-nav_item-focussed-text`}
                          ></div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  )}
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem className="sidebar-menu-item">
                <Link to="/profile">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`h-fit !cursor-pointer !p-2
                      hover:!bg-nav_item-hover-bg
                      data-active:!bg-nav_item-focussed-bg
                      data-active:!text-nav_item-focussed-text`}
                    >
                      <div className="flex w-full items-center gap-2">
                        <SquareLibrary />
                        <p className="p-m-medium w-full">Profile</p>
                        {isActive && (
                          <div
                            className={`h-5 w-1 rounded-lg
                            bg-nav_item-focussed-text`}
                          ></div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  )}
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem className="sidebar-menu-item">
                <Link to="/admin">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`h-fit !cursor-pointer !p-2
                      hover:!bg-nav_item-hover-bg
                      data-active:!bg-nav_item-focussed-bg
                      data-active:!text-nav_item-focussed-text`}
                    >
                      <div className="flex w-full items-center gap-2">
                        <SquareLibrary />
                        <p className="p-m-medium w-full">Admin</p>
                        {isActive && (
                          <div
                            className={`h-5 w-1 rounded-lg
                            bg-nav_item-focussed-text`}
                          ></div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  )}
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarMenu className="sidebar-menu text-txt-neutral-p2-active">
              <SidebarMenuItem
                className={'sidebar-menu-item cursor-pointer bg-transparent'}
              >
                <SidebarMenuButton>
                  <SidebarToggle className="bg-transparent p-0 shadow-none" />
                  <p className="p-m-medium">Collapsed</p>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem className="sidebar-menu-item">
                <Link to="/help-and-support">
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`h-fit !cursor-pointer !p-2
                      hover:!bg-nav_item-hover-bg
                      data-active:!bg-nav_item-focussed-bg
                      data-active:!text-nav_item-focussed-text`}
                    >
                      <div className="flex w-full items-center gap-2">
                        <SquareLibrary />
                        <p className="p-m-medium w-full">Help & Support</p>
                        {isActive && (
                          <div
                            className={`h-5 w-1 rounded-lg
                            bg-nav_item-focussed-text`}
                          ></div>
                        )}
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
              <div className="justify-content flex items-center gap-2">
                <Avatar
                  className={`size-10 rounded-sm border-1
                    border-outline-neutral-main-active after:rounded-[inherit]`}
                >
                  <AvatarImage
                    src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
                    alt="Hallie Richards"
                    className="rounded-sm"
                  />
                  <AvatarFallback>HR</AvatarFallback>
                </Avatar>

                <div className="w-full group-data-[collapsible=icon]:hidden">
                  <p className="p-m-medium">Dineth</p>
                  <p className="p-s-medium">dinethdsilva@gmail.com</p>
                </div>

                <button className="group-data-[collapsible=icon]:hidden">
                  <ChevronsUpDown size={16} />
                </button>
              </div>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
