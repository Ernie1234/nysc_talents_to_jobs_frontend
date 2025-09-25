import { useResumeContext } from "@/context/resume-info-provider";
import ProgressCard from "./ProgressCard";
import { useMemo } from "react";
import SkillChartLoader from "./SkilllChartLoarder";

const SkillChart = () => {
  const { resumeInfo, isLoading } = useResumeContext();

  console.log("Skills data here: ", resumeInfo);

  // Calculate trends based on skill updates (you might need to store historical data)
  const calculateTrend = (skills: any[]) => {
    // This is a simplified example - you'd need historical data for real trends
    const averageRating =
      skills.reduce((sum, skill) => sum + (skill.rating || 0), 0) /
      skills.length;

    // Mock trend calculation - replace with actual logic based on your data
    const trendValue = averageRating > 3 ? "↑8%" : "↓2%";
    const trendDescription =
      averageRating > 3 ? "vs last month" : "needs improvement";

    return { value: trendValue, description: trendDescription };
  };

  const progressData = useMemo(() => {
    if (!resumeInfo?.skills || resumeInfo.skills.length === 0) {
      return null;
    }

    const overallPercentage = Math.round(
      (resumeInfo.skills.reduce((sum, skill) => sum + (skill.rating || 0), 0) /
        (resumeInfo.skills.length * 5)) *
        100
    );

    const skillItems = resumeInfo.skills
      .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Sort by rating descending
      .map((skill) => ({
        label: skill.name,
        percentage: Math.round(((skill.rating || 0) / 5) * 100),
      }));

    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const trend = calculateTrend(resumeInfo.skills);

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
