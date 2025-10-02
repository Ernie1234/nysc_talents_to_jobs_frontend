/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BriefcaseBusiness,
  ChevronUp,
  Dock,
  FileUser,
  LayoutPanelLeft,
  Settings,
  LogOut,
  NotebookPen,
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
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
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
import { useLogoutMutation } from "@/features/auth/authAPI";
import { toast } from "sonner";
import { AUTH_ROUTES } from "@/routes/common/routePath";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const isInternUser = user?.role === "CORPS_MEMBER" || user?.role === "SIWES";
  const isStaffUser = user?.role === "STAFF";

  // Base menu items that are common for all users
  const baseItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutPanelLeft,
    },
    {
      title: !isInternUser ? "Create Job" : "Find Work",
      url: !isInternUser ? "/create-job" : "/find-work",
      icon: BriefcaseBusiness,
    },
    {
      title: !isInternUser ? "Applicants" : "Applications",
      url: "/dashboard/applications",
      icon: Dock,
    },
    {
      title: isInternUser || isStaffUser ? "Course" : "Approve Interns",
      url: isInternUser || isStaffUser ? "/courses" : "/approve-interns",
      icon: NotebookPen,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  // Add Resume item only for non-staff users (job seekers)
  const menuItems = !isInternUser
    ? baseItems
    : [
        ...baseItems.slice(0, 3), // Dashboard, Find Work, Applications
        {
          title: "Resume",
          url: "/dashboard/resume",
          icon: FileUser,
        },
        ...baseItems.slice(3), // Settings
      ];

  const handleSignOut = async () => {
    try {
      // Call the logout mutation
      await logoutMutation({}).unwrap();

      // Clear local state using the logout function from useAuth
      logout();

      // Show success message
      toast.success("Signed out successfully");

      // Redirect to login page
      navigate(AUTH_ROUTES.SIGN_IN);
    } catch (error: any) {
      console.error("Logout error:", error);

      // Even if the API call fails, clear local state
      logout();

      // Show appropriate error message
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Signed out locally (server error occurred)");
      }

      // Still redirect to login page
      navigate(AUTH_ROUTES.SIGN_IN);
    }
  };

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
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="py-5" asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-medium truncate max-w-[120px]">
                      {user?.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to={`/profile`} className="flex items-center w-full">
                    <FileUser className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`/settings/account`}
                    className="flex items-center w-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/settings/billing"
                    className="flex items-center w-full"
                  >
                    <BriefcaseBusiness className="w-4 h-4 mr-2" />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoading ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
