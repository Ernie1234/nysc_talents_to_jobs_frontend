import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { OnboardingDialog } from "@/components/onBoarding/OnboardingDialog";

const AppLayout = () => {
  return (
    <div className="">
      <OnboardingProvider>
        <SidebarProvider className="gap-4">
          <AppSidebar />
          <div className="w-full">
            <SidebarInset>
              <AppHeader />
              <div className="py-3 ml-3 md:ml-0 mr-3">
                <Outlet />
                <OnboardingDialog />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </OnboardingProvider>
    </div>
  );
};

export default AppLayout;
