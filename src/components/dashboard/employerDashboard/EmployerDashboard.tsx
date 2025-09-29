import { Briefcase, Users, Edit3, type LucideIcon, Eye } from "lucide-react";
import QuickCard from "./QuickCard";
import { JobView } from "./JobView";
import PostedJob from "./PostedJob";
import { useGetEmployerAnalysisQuery } from "@/features/job/jobAPI";

interface QuickCardData {
  id: number;
  title: string;
  number: number | string;
  icon: LucideIcon;
  color?: string;
}

const EmployerDashboard = () => {
  const {
    data: analysisData,
    isLoading,
    error,
  } = useGetEmployerAnalysisQuery();

  console.log(analysisData);

  // Format numbers with proper formatting
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // Prepare the data for QuickCards
  const quickCardData: QuickCardData[] = [
    {
      id: 1,
      title: "Posted Jobs",
      number: analysisData?.data.totalJobs || 0,
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Total Applicants",
      number: formatNumber(analysisData?.data.totalApplicants || 0),
      icon: Users,
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Shortlisted",
      number: analysisData?.data.shortlistedCount || 0,
      icon: Edit3,
      color: "bg-orange-500",
    },

    {
      id: 6,
      title: "Total Views",
      number: formatNumber(analysisData?.data.totalViews || 0),
      color: "bg-indigo-500",
      icon: Eye,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading dashboard data</p>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h4 className="scroll-m-20 text-3xl font-semibold text-green-800 tracking-tight font-raleway">
        Dashboard
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-4 mt-8">
        {quickCardData.map((item) => (
          <QuickCard
            key={item.id}
            title={item.title}
            number={item.number}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>
      <div className="flex flex-col md:flex-row mt-8 gap-4">
        <div className="w-full md:w-7/12">
          <JobView analysisData={analysisData?.data} />
        </div>
        <div className="w-full md:w-5/12">
          <PostedJob />
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
