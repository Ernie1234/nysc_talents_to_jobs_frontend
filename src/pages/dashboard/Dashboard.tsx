import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  console.log("Dashboard - isAuthenticated:", isAuthenticated);
  console.log("Dashboard - user:", user);

  return (
    <div>
      Dashboard
      {isAuthenticated && user ? (
        <div>
          <h1>Welcome, {user.fullName}!</h1>
          <p>Your email: {user.email}</p>
        </div>
      ) : (
        <p>Please log in to see your dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
