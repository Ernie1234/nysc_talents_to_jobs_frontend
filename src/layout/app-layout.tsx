import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const AppLayout = () => {
  return (
    // <div classN">
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <SidebarInset>
          <AppHeader />
          <div className="py-3">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
    // </div>
  );
};

export default AppLayout;
