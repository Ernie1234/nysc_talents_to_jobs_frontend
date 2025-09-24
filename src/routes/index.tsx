import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  authenticationRoutePaths,
  protectedRoutePaths,
  publicRoutePaths,
} from "./common/routes";
import AuthRoute from "./authRoute";
import ProtectedRoute from "./protectedRoute";
import useAuthExpiration from "@/hooks/use-auth-expiration";
import BaseLayout from "@/layout/base-layout";
import AppLayout from "@/layout/app-layout";
import HomeLayout from "@/layout/HomeLayout";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./common/routePath";

function AppRoutes() {
  useAuthExpiration();
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Accessible to all */}
        <Route element={<HomeLayout />}>
          {publicRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Auth Routes - Only for unauthenticated users */}
        <Route element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        {/* Protected Routes - Only for authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Map parent routes with children */}
            {protectedRoutePaths.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {/* Render child routes */}
                {route.children?.map((childRoute) => (
                  <Route
                    key={
                      childRoute.path || childRoute.index ? "index" : "child"
                    }
                    index={childRoute.index}
                    path={childRoute.path}
                    element={childRoute.element}
                  />
                ))}
              </Route>
            ))}

            {/* Redirect root to dashboard when authenticated */}
            <Route
              path="/"
              element={<Navigate to={PROTECTED_ROUTES.DASHBOARD} replace />}
            />
          </Route>
        </Route>

        {/* Redirect from root based on auth status */}
        <Route
          path="/"
          element={<Navigate to={PUBLIC_ROUTES.HOME} replace />}
        />

        {/* Catch-all for undefined routes */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-lg">Page not found</p>
                <Navigate to={PUBLIC_ROUTES.HOME} replace />
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
