// pages/JobDetailsPage.tsx
import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Building,
  Clock,
  Users,
  Briefcase,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetPublicJobDetailsQuery,
  useUpdateJobViewCountMutation,
} from "@/features/job/jobAPI";
import ApplyButton from "./ApplyButton.tsx";

const JobDetailsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const {
    data: jobData,
    isLoading,
    error,
  } = useGetPublicJobDetailsQuery(jobId!);
  const [updateViewCount] = useUpdateJobViewCountMutation();

  const hasUpdatedViewCount = useRef(false);

  const job = jobData?.data;

  useEffect(() => {
    if (jobId && !hasUpdatedViewCount.current) {
      hasUpdatedViewCount.current = true;
      updateViewCount(jobId);
    }
  }, [jobId, updateViewCount]);

  if (isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Job not found
            </h3>
            <p className="text-gray-600 mb-4">
              The job you're looking for doesn't exist or is no longer
              available.
            </p>
            <Link to="/find-work">
              <Button>Browse All Jobs</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "fulltime":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "part-time":
        return "bg-green-50 text-green-700 border-green-200";
      case "contract":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "intern":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "senior-level":
        return "bg-red-50 text-red-700 border-red-200";
      case "mid-level":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "entry-level":
        return "bg-green-50 text-green-700 border-green-200";
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
      case "on-site":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "hybrid":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatSalary = (salary: {
    min: number;
    max: number;
    currency: string;
  }) => {
    return `${
      salary.currency
    } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-0">
      <div className="">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <Link to="/find-work">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600">Job Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {job.employerId?.firstName?.charAt(0) || "C"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>
                          {job.employerId?.companyName ||
                            `${job.employerId?.firstName} ${job.employerId?.lastName}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {job.hiringLocation.type === "state"
                            ? job.hiringLocation.state || "Nationwide"
                            : "Nationwide"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getJobTypeColor(job.jobType)}>
                        <Briefcase className="h-3 w-3 mr-1" />
                        {job.jobType}
                      </Badge>
                      <Badge
                        className={getExperienceColor(job.experienceLevel)}
                      >
                        {job.experienceLevel}
                      </Badge>
                      <Badge className={getJobStyleColor(job.workLocation)}>
                        {job.workLocation}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    Posted{" "}
                    {new Date(
                      job.publishedAt || job.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {job.applicationCount} applicant
                    {job.applicationCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>
                    <Eye />
                  </span>
                  <span>{job.viewCount} views</span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About the Job
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.aboutJob}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Requirements
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.requirements}
              </p>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary Information */}
            {job.salaryRange?.isPublic && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Salary
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatSalary(job.salaryRange)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Per year</p>
              </div>
            )}

            {/* Job Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Job Details
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Job Type
                  </span>
                  <p className="text-gray-900 capitalize">{job.jobType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Experience Level
                  </span>
                  <p className="text-gray-900 capitalize">
                    {job.experienceLevel}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Work Location
                  </span>
                  <p className="text-gray-900 capitalize">{job.workLocation}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Job Period
                  </span>
                  <p className="text-gray-900">{job.jobPeriod}</p>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <ApplyButton
              jobId={jobId!}
              jobTitle={job.title}
              companyName={
                job.employerId?.companyName ||
                `${job.employerId?.firstName} ${job.employerId?.lastName}`
              }
              className="w-full py-3 text-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for loading state
const JobDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-9 w-24" />
          <div>
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
