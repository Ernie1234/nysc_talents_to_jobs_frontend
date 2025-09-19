import { Outlet, useNavigate } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import Header from "../../components/Header";
import Asidebar from "../../components/Asidebar";

// A simple dashboard layout component
export const DashboardLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("mock_current_user");
    navigate('/auth/login');
  };

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
