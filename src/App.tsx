import { Route, Routes, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import LoginPage from "./pages/authPages/LoginPage"
import RegisterPage from "./pages/authPages/RegisterPage"
import { useEffect } from "react"
import { DashboardLayout } from "./pages/dashboardPages/DashboardLayout"
import { ProfilePage } from "./pages/dashboardPages/ProfilePage"
import { Dashboard } from "./pages/dashboardPages/Dashboard"

 const App = () => {


  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("mock_current_user");
    // const users = localStorage.getItem("mock_user");
    if (currentUser) {
      navigate('/dashboard');
    }

  }, [navigate]);
  return (

   <Routes>
      {/* Route for the homepage */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/auth/login" element={<LoginPage />}  />
      <Route path="/auth/register" element={<RegisterPage />}  />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
export default App