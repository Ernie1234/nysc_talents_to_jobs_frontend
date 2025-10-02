/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/applications-table.tsx - FIXED VERSION
import { useState } from "react";
import { Search, Download, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetAllApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "@/features/admin/adminAPI";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  under_review: "bg-blue-100 text-blue-800",
  shortlisted: "bg-purple-100 text-purple-800",
  interview: "bg-indigo-100 text-indigo-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-800",
};

// Define proper types for filters
interface ApplicationFilters {
  status?: string;
  role?: string;
  search?: string;
  page: number;
  limit: number;
}

export const ApplicationsTable = () => {
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: undefined,
    role: undefined,
    search: "",
    page: 1,
    limit: 20,
  });

  const { data, isLoading, error, refetch } =
    useGetAllApplicationsQuery(filters);
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      await updateApplicationStatus({
        applicationId,
        status: newStatus,
      }).unwrap();
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update application status"
      );
    }
  };

  const handleFilterChange = (
    key: keyof ApplicationFilters,
    value: string | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Helper function to convert undefined to "all" for Select values
  const getSelectValue = (value: string | undefined): string => {
    return value || "all";
  };

  // Helper function to convert "all" back to undefined for API calls
  const getApiValue = (value: string): string | undefined => {
    return value === "all" ? undefined : value;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load applications
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading applications.
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <CardTitle>Applications Management</CardTitle>
            <CardDescription>
              View and manage all job applications
            </CardDescription>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search applications..."
              value={filters.search || ""}
              onChange={(e) =>
                handleFilterChange("search", e.target.value || undefined)
              }
              className="pl-10"
            />
          </div>
          <Select
            value={getSelectValue(filters.status)}
            onValueChange={(value) =>
              handleFilterChange("status", getApiValue(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={getSelectValue(filters.role)}
            onValueChange={(value) =>
              handleFilterChange("role", getApiValue(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="User Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="CORPS_MEMBER">Corps Member</SelectItem>
              <SelectItem value="SIWES">SIWES</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.applications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.applications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {application.userId.firstName}{" "}
                          {application.userId.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.userId.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {application.jobId.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.jobId.jobType}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{application.userId.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[application.status]}>
                        {application.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                application._id,
                                "under_review"
                              )
                            }
                          >
                            Mark as Under Review
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(application._id, "shortlisted")
                            }
                          >
                            Mark as Shortlisted
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(application._id, "interview")
                            }
                          >
                            Mark for Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(application._id, "accepted")
                            }
                          >
                            Accept Application
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(application._id, "rejected")
                            }
                          >
                            Reject Application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data && data.data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {(filters.page - 1) * filters.limit + 1} to{" "}
              {Math.min(filters.page * filters.limit, data.data.total)} of{" "}
              {data.data.total} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={filters.page === data.data.totalPages}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
