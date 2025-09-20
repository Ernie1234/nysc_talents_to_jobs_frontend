import { Outlet, } from "react-router-dom";
import { SidebarInset, SidebarProvider,  } from "../../components/ui/sidebar";
import Header from "../../components/Header";
import Asidebar from "../../components/Asidebar";

// A simple dashboard layout component
export const DashboardLayout = () => {
  

  return (
    <SidebarProvider>
        <Asidebar />
        <SidebarInset className="overflow-x-hidden">
          <div className="w-full">
            <>
              <Header />
              <div className="px-3 lg:px-20 py-3">
                <Outlet />
              </div>
            </>
          </div>
        </SidebarInset>
      </SidebarProvider>
  );
};
