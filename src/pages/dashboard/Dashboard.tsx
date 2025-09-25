import ResumeList from "@/components/dashboard/resume/ResumeList";
import SkillWrapper from "@/components/dashboard/SkillWrapper";
import Wrapper from "@/components/dashboard/Wrapper";
import { useAuth } from "@/hooks/useAuth";
import { getTimeBasedGreeting } from "@/lib/helpers";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  console.log("Dashboard - isAuthenticated:", isAuthenticated);
  console.log("Dashboard - user:", user);

  return (
    <div className="w-full h-full space-y-3 font-raleway">
      <Wrapper>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {getTimeBasedGreeting(user?.firstName)} 👋
        </h4>
      </Wrapper>

      <Wrapper>
        <SkillWrapper />
      </Wrapper>

      <div className="p-3 rounded-md shadow bg-white flex flex-col space-y-6">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          My Recent Resume
        </h4>
        <div className="flex space-x-3">
          <ResumeList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
