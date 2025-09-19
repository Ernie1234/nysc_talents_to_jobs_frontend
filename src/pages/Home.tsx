import { useEffect } from "react";

const Home = () => {

  useEffect(() => {
    const currentUser = localStorage.getItem("mock_current_user");
    if (currentUser) {
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <div>Home</div>
  )
}

export default Home