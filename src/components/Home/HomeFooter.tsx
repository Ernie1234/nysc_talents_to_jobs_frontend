const HomeFooter = () => {
  return (
    <div className="flex justify-center items-center p-4 md:p-8 bg-green-950 text-white text-sm text-center md:text-xl">
      &copy; {new Date().getFullYear()} COPA. All rights reserved. Build with ❤️
      by Christian, Joshua, Ejidike, Sijuwola
    </div>
  );
};

export default HomeFooter;
