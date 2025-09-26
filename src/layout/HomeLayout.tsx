import HeroSection from "@/components/Home/HeroSection";
import HomeFooter from "@/components/Home/HomeFooter";
import HomeNav from "@/components/Home/HomeNav";
import SuccessCount from "@/components/Home/SuccessCount";
import WhyCopa from "@/components/Home/WhyCopa";

const HomeLayout = () => {
  return (
    <div className="flex flex-col w-full h-auto">
      <div className="w-full h-full flex flex-col">
        <HomeNav />
        <div className="px-24 py-4 space-y-6">
          <HeroSection />
          <SuccessCount />
          <WhyCopa />
        </div>
        <HomeFooter />
      </div>
    </div>
  );
};

export default HomeLayout;
