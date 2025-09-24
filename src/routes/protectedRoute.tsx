import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_ROUTES } from "./common/routePath";

const ProtectedRoute = () => {
  const { accessToken, user } = useTypedSelector((state) => state.auth);
  const location = useLocation();

  // If not authenticated, redirect to login with return url
  if (!accessToken || !user) {
    return (
      <Navigate to={AUTH_ROUTES.SIGN_IN} replace state={{ from: location }} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
