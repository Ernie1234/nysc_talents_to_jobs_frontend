/* eslint-disable @typescript-eslint/no-explicit-any */
import { useResumeContext } from "@/context/resume-info-provider";
import ProgressCard from "./ProgressCard";
import { useMemo } from "react";
import SkillChartLoader from "./SkilllChartLoarder";

const SkillChart = () => {
  const { resumeInfo, isLoading } = useResumeContext();

  console.log("Skills data here: ", resumeInfo);

  const calculateTrend = (skills: any[]) => {
    const averageRating =
      skills.reduce((sum, skill) => sum + (skill.rating || 0), 0) /
      skills.length;

    const trendValue = averageRating > 3 ? "↑8%" : "↓2%";
    const trendDescription =
      averageRating > 3 ? "vs last month" : "needs improvement";

    return { value: trendValue, description: trendDescription };
  };

  const progressData = useMemo(() => {
    if (!resumeInfo?.skills || resumeInfo.skills.length === 0) {
      return null;
    }

    // Filter out skills with null or undefined names
    const validSkills = resumeInfo.skills.filter(
      (skill) => skill.name != null && skill.name.trim() !== ""
    );

    if (validSkills.length === 0) {
      return null;
    }

    const overallPercentage = Math.round(
      (validSkills.reduce((sum, skill) => sum + (skill.rating || 0), 0) /
        (validSkills.length * 5)) *
        100
    );

    const skillItems = validSkills
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .map((skill) => ({
        label: skill.name!, // Use non-null assertion since we filtered
        percentage: Math.round(((skill.rating || 0) / 5) * 100),
      }));

    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const trend = calculateTrend(validSkills);

    return {
      percentage: overallPercentage,
      date: currentDate,
      trend,
      title:
        overallPercentage > 70
          ? "Excellent!"
          : overallPercentage > 50
          ? "Good progress!"
          : "Keep learning!",
      items: skillItems,
    };
  }, [resumeInfo]);

  if (isLoading) {
    return <SkillChartLoader />;
  }

  if (!progressData) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-muted-foreground">No skills data available</p>
      </div>
    );
  }

  return <ProgressCard {...progressData} />;
};

export default SkillChart;
