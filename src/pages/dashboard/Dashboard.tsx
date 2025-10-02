import AdminDashboard from "@/components/admin/AdminDashboard";
import { SkillsRadarChart } from "@/components/dashboard/ApplicationChart"; // Import Skill here
import ResumeList from "@/components/dashboard/resume/ResumeList";
import StaffDashboard from "@/components/dashboard/StaffDashboard.tsx/EmployerDashboard";
import { StatusTracking } from "@/components/dashboard/StatusTracking";
import Wrapper from "@/components/dashboard/Wrapper";
import { RecentActivities } from "@/components/recentActivities/RecentActivities";
import { useAuth } from "@/hooks/useAuth";
import { getTimeBasedGreeting } from "@/lib/helpers";
import { useMemo } from "react";

interface Skill {
  name: string;
  level: number;
  _id?: string;
}
const Dashboard = () => {
  const { user } = useAuth();

  const isInternUser = user?.role === "CORPS_MEMBER" || user?.role === "SIWES";
  const isAdminUser = user?.role === "ADMIN";

  // Validate and transform skills data
  const userSkills: Skill[] = useMemo(() => {
    const rawSkills = user?.profile?.skills as
      | { name?: string; level?: number; _id?: string }[]
      | undefined;

    if (!rawSkills || !Array.isArray(rawSkills)) {
      return [];
    }

    // Ensure each skill has the correct structure
    return rawSkills.map((skill) => ({
      name: skill.name || "Unknown Skill",
      level: typeof skill.level === "number" ? skill.level : 1,
      _id: skill._id || Math.random().toString(),
    })) as Skill[];
  }, [user?.profile?.skills]);

  console.log("user:", user);
  console.log("userSkills:", userSkills);

  if (isAdminUser) {
    return <AdminDashboard />;
  }

  return (
    <>
      {isInternUser ? (
        <div className="w-full h-full space-y-3 font-raleway">
          <Wrapper>
            <h4 className="scroll-m-20 text-xl font-semibold text-green-800 tracking-tight">
              {getTimeBasedGreeting(user?.firstName)} 👋
            </h4>
          </Wrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatusTracking
              status={user?.profile?.status || "PENDING"}
              userRole={user?.role}
            />
            <RecentActivities />
            <SkillsRadarChart skills={userSkills} />
          </div>

          <div className="p-3 rounded-md shadow bg-white flex flex-col space-y-6">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              My Recent Resume
            </h4>
            <div className="flex space-x-3">
              <ResumeList />
            </div>
          </div>
        </div>
      ) : (
        <StaffDashboard />
      )}
    </>
  );
};

export default Dashboard;
