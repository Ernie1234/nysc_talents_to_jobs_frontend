import { ApplicationChart } from "@/components/dashboard/ApplicationChart";
import { ProfileCompletion } from "@/components/dashboard/ProfileCompletion";
import ResumeList from "@/components/dashboard/resume/ResumeList";
import SkillWrapper from "@/components/dashboard/SkillWrapper";
import StaffDashboard from "@/components/dashboard/StaffDashboard.tsx/EmployerDashboard";
import Wrapper from "@/components/dashboard/Wrapper";
import { RecentActivities } from "@/components/recentActivities/RecentActivities";

import { useAuth } from "@/hooks/useAuth";
import { getTimeBasedGreeting } from "@/lib/helpers";
import { calculateCompletionPercentage, defaultTasks } from "@/lib/mockData";
import type { ProfileTask } from "@/types/progressCardTypes";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<ProfileTask[]>(defaultTasks);
  const completionPercentage = calculateCompletionPercentage(tasks);

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };
  const handleViewAll = () => {
    // Navigate to full profile page or show modal
    console.log("View all tasks");
  };

  return (
    <>
      {user?.role === "interns" ? (
        <div className="w-full h-full space-y-3 font-raleway">
          <Wrapper>
            <h4 className="scroll-m-20 text-xl font-semibold text-green-800 tracking-tight">
              {getTimeBasedGreeting(user?.firstName)} 👋
            </h4>
          </Wrapper>

          <div className="flex flex-col md:flex-row gap-4">
            <ProfileCompletion
              completionPercentage={completionPercentage}
              tasks={tasks}
              onTaskToggle={handleTaskToggle}
              onViewAll={handleViewAll}
            />
            <RecentActivities />
            <ApplicationChart />
          </div>

          <div className="p-3 rounded-md shadow bg-white flex flex-col space-y-6">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              My Recent Resume
            </h4>
            <div className="flex space-x-3">
              <ResumeList />
            </div>
          </div>
          <Wrapper>
            <SkillWrapper />
          </Wrapper>
        </div>
      ) : (
        <StaffDashboard />
      )}
    </>
  );
};

export default Dashboard;
