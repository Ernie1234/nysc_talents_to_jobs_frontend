import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/authPages/LoginPage";
import RegisterPage from "./pages/authPages/RegisterPage";
import { DashboardLayout } from "./pages/dashboardPages/DashboardLayout";
import { ProfilePage } from "./pages/dashboardPages/ProfilePage";
import { Dashboard } from "./pages/dashboardPages/Dashboard";
import { Suspense } from "react";
import { Skeleton } from "./components/ui/skeleton";
import GoogleAuthSuccess from "./components/auth/GoogleAuthSuccess";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Routes>
        {/* Route for the homepage */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/success" element={<GoogleAuthSuccess />} />

        {/* Protected Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
