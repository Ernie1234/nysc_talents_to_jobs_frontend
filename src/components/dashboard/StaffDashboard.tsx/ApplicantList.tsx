// features/application/ApplicationList.tsx
import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Download,
  Eye,
  User,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetStaffApplicationsQuery,
  useUpdateApplicationMutation,
} from "@/features/applications/applicationAPI";
import type { ApplicationStatus } from "@/features/applications/application-types";
import { ApplicationDetails } from "./ApplicationDetails";
import { useAuth } from "@/hooks/useAuth";

const ApplicationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const { user } = useAuth();
  const [viewApplication, setViewApplication] = useState<string | null>(null);

  const {
    data: applicationsData,
    isLoading,
    error,
  } = useGetStaffApplicationsQuery({
    status: selectedStatus !== "All" ? selectedStatus : undefined,
    search: searchTerm || undefined,
    page: 1,
    limit: 50,
  });

  const [updateApplication] = useUpdateApplicationMutation();

  const applications = applicationsData?.data.applicants || [];
  const totalApplications = applicationsData?.data.total || 0;

  const statuses: ApplicationStatus[] = [
    "pending",
    "under_review",
    "shortlisted",
    "interview",
    "rejected",
    "accepted",
    "withdrawn",
  ];

  const getStatusVariant = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "under_review":
        return "default";
      case "shortlisted":
        return "default";
      case "interview":
        return "default";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      case "withdrawn":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "under_review":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "shortlisted":
        return "text-green-600 bg-green-50 border-green-200";
      case "interview":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "accepted":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "withdrawn":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      await updateApplication({
        applicationId,
        updates: { status: newStatus },
      }).unwrap();
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (viewApplication) {
    return (
      <ApplicationDetails
        applicationId={viewApplication}
        onBack={() => setViewApplication(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center py-8">
            <p className="text-lg font-semibold">Error loading applications</p>
            <p className="text-sm">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-2">
              Manage and review job applications from candidates
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {totalApplications}
              </div>
              <p className="text-sm text-gray-600 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Under Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {
                  applications.filter((app) => app.status === "under_review")
                    .length
                }
              </div>
              <p className="text-sm text-gray-600 mt-1">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Interview Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {
                  applications.filter((app) => app.status === "interview")
                    .length
                }
              </div>
              <p className="text-sm text-gray-600 mt-1">Scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Accepted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {applications.filter((app) => app.status === "accepted").length}
              </div>
              <p className="text-sm text-gray-600 mt-1">Successful hires</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search applicants by name, email, or job title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Status: {selectedStatus}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setSelectedStatus("All")}
                      >
                        All Statuses
                      </DropdownMenuItem>
                      {statuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                        >
                          <span className="capitalize">
                            {status.replace("_", " ")}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              {totalApplications} applications found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow
                    key={application.id}
                    className="hover:bg-gray-50/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {application.user?.fullName || "Unknown Candidate"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.user?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {application.job?.title || "Unknown Job"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(application.appliedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={getStatusVariant(
                            application.status as ApplicationStatus
                          )}
                          className={`capitalize w-fit border ${getStatusColor(
                            application.status as ApplicationStatus
                          )}`}
                        >
                          {application.status.replace("_", " ")}
                        </Badge>
                        {application.reviewedAt && (
                          <span className="text-xs text-gray-500">
                            Reviewed {formatDate(application.reviewedAt)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(application.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => setViewApplication(application.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>

                          {user && user.role === "ADMIN" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Filter className="h-4 w-4 mr-2" />
                                  Change Status
                                </DropdownMenuItem>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="right"
                                className="w-40"
                              >
                                {statuses.map((status) => (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() =>
                                      handleStatusUpdate(application.id, status)
                                    }
                                    disabled={application.status === status}
                                  >
                                    <span className="capitalize">
                                      {status.replace("_", " ")}
                                    </span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" />
                            Schedule Call
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {applications.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <User className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">No applications found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm || selectedStatus !== "All"
                    ? "Try adjusting your filters"
                    : "Applications will appear here when candidates apply to your jobs"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationList;
