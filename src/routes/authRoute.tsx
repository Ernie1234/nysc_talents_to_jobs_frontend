import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "./common/routePath";

const AuthRoute = () => {
  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const location = useLocation();

  // If user is authenticated, redirect to intended page or dashboard
  if (accessToken && user) {
    const from = location.state?.from?.pathname || PROTECTED_ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
