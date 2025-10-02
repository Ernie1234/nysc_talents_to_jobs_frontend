import { MapPin, Clock, Users } from "lucide-react";
import JobManagementDialog from "./JobManagementDialog"; // Ensure this import is present
import type { IJob } from "@/features/job/jobTypes";

// FIX: Define a proper props interface to correctly type the 'job' prop
interface JobItemProps {
  job: IJob;
}

const JobItem = ({ job }: JobItemProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-600 bg-green-100";
      case "draft":
        return "text-yellow-600 bg-yellow-100";
      case "closed":
        return "text-red-600 bg-red-100";
      case "archived":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getLocationText = (workLocation: string) => {
    switch (workLocation) {
      case "remote":
        return "Remote";
      case "on-site":
        return "On-site";
      case "hybrid":
      default:
        return "Hybrid";
    }
  };

  return (
    <div className="flex items-center justify-between py-2  border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        {/* Company Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-gray-50 border">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.title} logo`}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {job.staffId.firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-gray-800 truncate text-sm">
              {job.title}
            </h3>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                job.status
              )}`}
            >
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.jobType}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {getLocationText(job.workLocation)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {job.applicationCount} applicants
            </span>
          </div>
          <span className="text-gray-400 text-xs">
            Posted {formatDate(job.createdAt)}
          </span>
        </div>
      </div>

      {/* Management Dialog */}
      <JobManagementDialog job={job} />
    </div>
  );
};

export default JobItem;
