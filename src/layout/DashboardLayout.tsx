import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <main className="p-4 md:p-6 lg:p-8 flex">
      <div>DashboardLayout</div>
      <Outlet />
    </main>
  );
};
