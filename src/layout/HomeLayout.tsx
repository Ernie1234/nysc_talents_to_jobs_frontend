import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="flex flex-col w-full h-auto">
      <div className="w-full h-full flex items-center justify-center">
        Home Navigation
        <div className="w-full mx-auto h-auto ">
          Home Layout
          <Outlet />
        </div>
        Home Footer
      </div>
    </div>
  );
};

export default HomeLayout;
