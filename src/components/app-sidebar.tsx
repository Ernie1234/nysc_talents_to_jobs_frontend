import {
  BriefcaseBusiness,
  ChevronUp,
  Dock,
  FileUser,
  LayoutPanelLeft,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from "./ui/avatar";
import { getCapitalizedInitials } from "@/lib/helpers";
import { Separator } from "./ui/separator";
import Logo from "./logo";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutPanelLeft,
  },
  {
    title: "Find Work",
    url: "/find-work",
    icon: BriefcaseBusiness,
  },
  {
    title: "Applications",
    url: "dashboard/applications",
    icon: Dock,
  },
  {
    title: "Resume",
    url: "/dashboard/resume",
    icon: FileUser,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="rounded-t-md bg-white">
        <div className="flex h-[50px] items-center justify-start w-full px-1">
          <Logo />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="bg-white">
        <SidebarGroup>
          {/* <SidebarGroupLabel>COFA</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="py-5" asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter className="bg-white rounded-b-md">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="">
                    <AvatarImage src="/media/avatars/14.png" alt="@reui" />
                    <AvatarFallback>
                      <span className="text-base font-semibold leading-none">
                        {getCapitalizedInitials(user?.fullName as string)}
                      </span>
                    </AvatarFallback>
                    <AvatarIndicator className="-end-1.5 -top-1.5">
                      <AvatarStatus variant="online" className="size-2.5" />
                    </AvatarIndicator>
                  </Avatar>
                  {user?.fullName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem>
                  <Link to={`/profile`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to={`/settings/account`}>Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings">Billing</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
