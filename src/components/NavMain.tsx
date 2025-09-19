import {
  type LucideIcon,
  Users,
  CheckCircle,
  LayoutDashboard,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

type ItemType = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export function NavMain() {
  const location = useLocation();

  const pathname = location.pathname;

  const items: ItemType[] = [
    {
      title: "Dashboard",
      url: `/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      url: `/dashboard/profile`,
      icon: CheckCircle,
    },
    {
      title: "Companies",
      url: `/dashboard/company`,
      icon: Users,
    }   
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={item.url === pathname}
              asChild
              className="hover:bg-muted-foreground/10"
            >
              <Link to={item.url} className="!text-[15px]">
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}