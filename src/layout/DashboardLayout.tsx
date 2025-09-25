import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <main className="min-h-screen">
      <Outlet />
    </main>
  );
};
