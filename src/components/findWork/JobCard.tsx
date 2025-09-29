import { useNavigate } from "react-router-dom";

import {
  Building,
  MapPin,
  Clock,
  Users,
  Briefcase,
  Star,
  Map,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ApplyButton from "./ApplyButton.tsx";

interface JobCardProps {
  jobId: string;
  companyLogo?: string;
  companyInitial?: string;
  jobTitle: string;
  companyName: string;
  location: string;
  description: string;
  postedTime: string;
  applicants: number;
  jobType: string;
  experienceLevel: string;
  jobStyle: string;
  isFeatured?: boolean;
  viewMode?: "list" | "grid";
  viewCounts: number | null;
  onClick?: () => void;
}

const JobCard = ({
  jobId,
  companyLogo,
  companyInitial = "G",
  jobTitle,
  companyName,
  location,
  description,
  postedTime,
  applicants,
  jobType,
  experienceLevel,
  jobStyle,
  isFeatured = false,
  viewMode = "list",
  viewCounts,
  onClick,
}: JobCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate to job details page
      navigate(`/find-work/${jobId}`);
    }
  };
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full time":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "part time":
        return "bg-green-50 text-green-700 border-green-200";
      case "contract":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "internship":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "senior level":
        return "bg-red-50 text-red-700 border-red-200";
      case "mid-senior level":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "intermediate level":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "entry level":
        return "bg-green-50 text-green-700 border-green-200";
      case "associate level":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "intern":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getJobStyleColor = (style: string) => {
    switch (style) {
      case "remote":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "onsite":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "hybrid":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (viewMode === "grid") {
    return (
      <Card
        className={`h-full border-border/40 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
          isFeatured ? "border-l-4 border-l-green-500" : ""
        }`}
        onClick={handleClick}
      >
        <CardContent className="p-4 h-full flex flex-col">
          {/* Header Section */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {companyInitial}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-foreground truncate">
                  {jobTitle}
                </h3>
                {isFeatured && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-1 py-0"
                  >
                    Popular
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Building className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{companyName}</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>

          {/* Job Metadata Badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge
              variant="outline"
              className={`text-xs capitalize ${getJobTypeColor(jobType)}`}
            >
              <Briefcase className="h-3 w-3 mr-1" />
              {jobType}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs capitalize ${getExperienceColor(
                experienceLevel
              )}`}
            >
              <Star className="h-3 w-3 mr-1" />
              {experienceLevel}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs capitalize ${getJobStyleColor(jobStyle)}`}
            >
              <Map className="h-3 w-3 mr-1" />
              {jobStyle}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
            {description}
          </p>

          {/* Footer Section */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{postedTime}</span>
              </div>

              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{applicants.toLocaleString()}</span>
              </div>
            </div>

            <ApplyButton
              jobId={jobId}
              jobTitle={jobTitle}
              companyName={companyName}
              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // List View
  return (
    <Card
      className={`w-full border-border/40 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        isFeatured ? "border-l-4 border-l-primary" : ""
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {companyInitial}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground font-nunito">
                  {jobTitle}
                </h3>
                {isFeatured && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                  >
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{companyName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              </div>

              {/* Job Metadata Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  variant="outline"
                  className={`capitalize ${getJobTypeColor(jobType)}`}
                >
                  <Briefcase className="h-3 w-3 mr-1" />
                  {jobType}
                </Badge>
                <Badge
                  variant="outline"
                  className={`capitalize ${getExperienceColor(
                    experienceLevel
                  )}`}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {experienceLevel}
                </Badge>
                <Badge
                  variant="outline"
                  className={`capitalize ${getJobStyleColor(jobStyle)}`}
                >
                  <Map className="h-3 w-3 mr-1" />
                  {jobStyle}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{postedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{viewCounts}</span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {applicants.toLocaleString()} Applicant
                {applicants !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <ApplyButton
            jobId={jobId}
            jobTitle={jobTitle}
            companyName={companyName}
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
