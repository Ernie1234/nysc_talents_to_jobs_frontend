import {
  Bookmark,
  Briefcase,
  Users,
  Edit3,
  type LucideIcon,
} from "lucide-react";
import QuickCard from "./QuickCard";
import { JobView } from "./JobView";
import PostedJob from "./PostedJob";

interface QuickCardData {
  id: number;
  title: string;
  number: number | string;
  icon: LucideIcon;
}

const data: QuickCardData[] = [
  {
    id: 1,
    title: "Posted Jobs",
    number: 7,
    icon: Briefcase,
  },
  {
    id: 2,
    title: "Shortlisted",
    number: 3,
    icon: Bookmark,
  },
  {
    id: 3,
    title: "Total Applicants",
    number: "1.7k",
    icon: Users,
  },
  {
    id: 4,
    title: "Saved Candidates",
    number: 4,
    icon: Edit3,
  },
];

const EmployerDashboard = () => {
  return (
    <div>
      <h4 className="scroll-m-20 text-3xl font-semibold text-green-800 tracking-tight font-raleway">
        Dashboard
      </h4>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mt-8">
        {data.map((item) => (
          <QuickCard
            key={item.id}
            title={item.title}
            number={item.number}
            icon={item.icon}
          />
        ))}
      </div>
      <div className="flex mt-8 gap-4">
        <div className="w-7/12">
          <JobView />
        </div>
        <div className="w-5/12">
          <PostedJob />
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
