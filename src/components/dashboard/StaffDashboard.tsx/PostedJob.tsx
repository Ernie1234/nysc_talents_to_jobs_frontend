import { useState } from "react";
import Wrapper from "../Wrapper";
import JobItem from "./JobItem";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useGetStaffJobsQuery } from "@/features/job/jobAPI";

const PostedJob = () => {
  const [limit] = useState(6);
  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useGetStaffJobsQuery({ limit });

  const jobs = jobsData?.data?.jobs || [];

  if (error) {
    return (
      <Wrapper className="flex flex-col p-6 rounded-2xl shadow-sm bg-white min-h-[350px]">
        <Alert variant="destructive" className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-4 flex-shrink-0" />
          <AlertDescription className="flex justify-between items-center w-full">
            Failed to load jobs.
            <Button
              variant="outline"
              onClick={refetch}
              className="p-0 h-auto text-sm"
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="flex flex-col p-6 rounded-2xl shadow-sm bg-white min-h-[350px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="scroll-m-20 text-2xl font-semibold text-green-800 tracking-tight font-raleway">
            Posted Jobs
          </h4>
          <p className="text-base text-gray-500">
            {isLoading
              ? "Loading..."
              : `${jobsData?.data?.total || 0} job${
                  (jobsData?.data?.total || 0) !== 1 ? "s" : ""
                } posted`}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
            <Link to="/create-job">
              <Plus className="w-4 h-4 mr-1" />
              New Job
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1">
        {isLoading ? (
          // Loading skeletons
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 py-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <Plus className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No jobs posted yet</p>
            <p className="text-sm text-center">
              Create your first job posting to start attracting talent
            </p>
            <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
              <Link to="/create-job">
                <Plus className="w-4 h-4 mr-1" />
                Create Job
              </Link>
            </Button>
          </div>
        ) : (
          // Jobs list
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {jobs.map((job) => (
              <JobItem key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Show View all jobs button only if total jobs > jobs shown */}
      {jobsData?.data && jobsData.data.total > jobs.length && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <Button
            asChild
            variant="outline"
            className="text-green-600 p-0 h-auto"
          >
            <Link to="/staff/jobs">View all jobs →</Link>
          </Button>
        </div>
      )}
    </Wrapper>
  );
};

export default PostedJob;
