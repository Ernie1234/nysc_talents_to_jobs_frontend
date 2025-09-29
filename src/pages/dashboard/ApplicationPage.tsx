// pages/ApplicationPage.tsx
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import ApplicantList from "@/components/dashboard/employerDashboard/ApplicantList";
import Wrapper from "@/components/dashboard/Wrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Filter, AlertCircle, RefreshCw } from "lucide-react";
import { useGetUserApplicationsQuery } from "@/features/applications/applicationAPI";
import ApplicationFilters from "@/components/dashboard/applications/ApplicationFilters";
import ApplicationCard from "@/components/dashboard/applications/ApplicationCard";

const ApplicationPage = () => {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { data, isLoading, error, refetch } = useGetUserApplicationsQuery();

  const applications = data?.data?.applications || [];
  const totalApplications = data?.data?.total || 0;

  // Filter applications based on selected status
  const filteredApplications = useMemo(() => {
    if (!selectedStatus) return applications;
    return applications.filter((app) => app.status === selectedStatus);
  }, [applications, selectedStatus]);

  // Count applications by status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  }, [applications]);

  if (user?.role !== "corps_member") {
    return <ApplicantList />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            My Applications
          </h4>
          <p>All my job applications</p>
        </div>

        <Wrapper>
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Failed to load applications
            </h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading your applications.
            </p>
            <Button onClick={refetch} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Wrapper>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          My Applications
        </h4>
        <p className="text-muted-foreground">
          {totalApplications} application{totalApplications !== 1 ? "s" : ""} in
          total
        </p>
      </div>

      {/* Stats Overview */}
      {!isLoading && applications.length > 0 && (
        <Wrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {statusCounts.pending || 0}
              </div>
              <div className="text-sm text-blue-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.shortlisted || 0}
              </div>
              <div className="text-sm text-green-600">Shortlisted</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {(statusCounts.under_review || 0) + (statusCounts.pending || 0)}
              </div>
              <div className="text-sm text-yellow-600">In Progress</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {(statusCounts.rejected || 0) +
                  (statusCounts.withdrawn || 0) +
                  (statusCounts.hired || 0)}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </Wrapper>
      )}

      {/* Filters */}
      {!isLoading && applications.length > 0 && (
        <Wrapper>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ApplicationFilters
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                Showing {filteredApplications.length} of {applications.length}{" "}
                applications
              </span>
            </div>
          </div>
        </Wrapper>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Wrapper key={index}>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </Wrapper>
          ))
        ) : filteredApplications.length > 0 ? (
          // Applications List
          filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))
        ) : applications.length === 0 ? (
          // No Applications State
          <Wrapper>
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No applications yet
              </h3>
              <p className="text-muted-foreground mb-6">
                You haven't applied to any jobs yet. Start browsing available
                positions to apply.
              </p>
              <Button onClick={() => (window.location.href = "/find-work")}>
                Browse Jobs
              </Button>
            </div>
          </Wrapper>
        ) : (
          // No Filtered Results
          <Wrapper>
            <div className="text-center py-12">
              <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No applications found
              </h3>
              <p className="text-muted-foreground">
                No applications match the selected filter. Try changing the
                status filter.
              </p>
            </div>
          </Wrapper>
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;
