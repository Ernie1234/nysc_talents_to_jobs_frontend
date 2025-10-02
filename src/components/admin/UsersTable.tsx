/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/users-table.tsx - FIXED VERSION
import { useState } from "react";
import { Search, Download, MoreHorizontal, Mail } from "lucide-react";
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
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/features/admin/adminAPI";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  SUSPENDED: "bg-orange-100 text-orange-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

const roleColors = {
  CORPS_MEMBER: "bg-blue-100 text-blue-800",
  SIWES: "bg-purple-100 text-purple-800",
  STAFF: "bg-indigo-100 text-indigo-800",
  ADMIN: "bg-gray-100 text-gray-800",
};

// Define proper types for filters - page and limit should be numbers
interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page: number;
  limit: number;
}

// Define the actual user type based on API response
interface ApiUser {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "CORPS_MEMBER" | "SIWES" | "STAFF" | "ADMIN";
  onboardingCompleted: boolean;
  profile?: {
    status: "ACCEPTED" | "REJECTED" | "SUSPENDED" | "PENDING";
    phoneNumber?: string;
    stateOfService?: string;
    tertiarySchool?: string;
    stateCode?: string;
    callUpNumber?: string;
    placeOfPrimaryAssignment?: string;
    dateOfBirth?: string;
    gender?: string;
  };
  staffProfile?: {
    companyName: string;
    companySize: string;
    industry: string;
    companyDescription: string;
    website: string;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

export const UsersTable = () => {
  const [filters, setFilters] = useState<UserFilters>({
    role: undefined,
    status: undefined,
    search: "",
    page: 1,
    limit: 20,
  });

  // Ensure page and limit are numbers when passing to the query
  const queryFilters = {
    ...filters,
    page: Number(filters.page),
    limit: Number(filters.limit),
  };

  const { data, isLoading, error, refetch } = useGetAllUsersQuery(queryFilters);
  const [updateUserStatus] = useUpdateUserStatusMutation();

  console.log("UsersTable data:", data);
  console.log("Current filters:", filters);
  console.log("Query filters:", queryFilters);

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      await updateUserStatus({ userId, status: newStatus }).unwrap();
      toast.success(`User status updated to ${newStatus}`);
      refetch(); // Refresh the data after update
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status");
    }
  };

  const handleFilterChange = (
    key: keyof UserFilters,
    value: string | number | undefined
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

  // Safely access the users data
  const users = data?.data?.users || [];
  const totalUsers = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  if (error) {
    console.error("Error loading users:", error);
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load users
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading users. Please try again.
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
            <CardTitle>Users Management</CardTitle>
            <CardDescription>
              View and manage all platform users
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
              placeholder="Search users..."
              value={filters.search || ""}
              onChange={(e) =>
                handleFilterChange("search", e.target.value || undefined)
              }
              className="pl-10"
            />
          </div>
          <Select
            value={getSelectValue(filters.role)}
            onValueChange={(value) =>
              handleFilterChange("role", getApiValue(value))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="CORPS_MEMBER">Corps Member</SelectItem>
              <SelectItem value="SIWES">SIWES</SelectItem>
              <SelectItem value="STAFF">Staff</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registered</TableHead>
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
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: ApiUser) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.profile?.stateCode &&
                            `State Code: ${user.profile.stateCode}`}
                          {user.profile?.callUpNumber &&
                            ` | Call-up: ${user.profile.callUpNumber}`}
                          {user.staffProfile?.companyName &&
                            ` | ${user.staffProfile.companyName}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          roleColors[user.role] || "bg-gray-100 text-gray-800"
                        }
                      >
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusColors[user.profile?.status || "PENDING"] ||
                          "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {user.profile?.status || "PENDING"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {user.profile?.phoneNumber && (
                        <div className="text-sm text-gray-500">
                          {user.profile.phoneNumber}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
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
                              handleStatusUpdate(user._id, "ACCEPTED")
                            }
                          >
                            Accept User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(user._id, "REJECTED")
                            }
                          >
                            Reject User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(user._id, "SUSPENDED")
                            }
                          >
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(user._id, "PENDING")
                            }
                          >
                            Set to Pending
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {(filters.page - 1) * filters.limit + 1} to{" "}
              {Math.min(filters.page * filters.limit, totalUsers)} of{" "}
              {totalUsers} results
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
                disabled={filters.page === totalPages}
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
