import { User } from "lucide-react";
import Logo from "../logo";
import { Link } from "react-router-dom";

const HomeNav = () => {
  return (
    <div className="flex sticky top-0 justify-between items-center container px-8 md:px-12 p-3 border-b z-50 bg-white shadow">
      <Logo />
      <div className="flex">
        <Link
          to="/auth/login"
          className="bg-green-900 rounded-full flex space-x-2 text-white items-center justify-between gap-3 py-2 px-4 md:text-xl font-semibold"
        >
          <User size={26} />
          Login
        </Link>
        {/* <Button>Register</Button> */}
      </div>
    </div>
  );
};

export default HomeNav;
