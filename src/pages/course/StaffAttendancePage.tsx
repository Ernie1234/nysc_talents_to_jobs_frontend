/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Search, UserCheck, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetCourseAttendanceQuery,
  useGetCourseQuery,
} from "@/features/courses/courseAPI";
import { useAuth } from "@/hooks/useAuth";

const StaffAttendancePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: courseData, isLoading: courseLoading } = useGetCourseQuery(
    courseId!
  );
  const { data: attendanceData, isLoading: attendanceLoading } =
    useGetCourseAttendanceQuery(courseId!);

  const course = courseData?.data;
  const attendance = attendanceData?.data;

  const isLoading = courseLoading || attendanceLoading;

  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600">
            Only staff members can access attendance data.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <AttendanceSkeleton />;
  }

  if (!course || !attendance) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Course Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Filter students based on search and status
  const filteredStudents = attendance.studentStats.filter((student: any) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pass" && student.status === "PASS") ||
      (statusFilter === "fail" && student.status === "FAIL");

    return matchesSearch && matchesStatus;
  });

  const getAttendanceBadge = (attendanceRate: number) => {
    if (attendanceRate >= 70) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          <UserCheck className="h-3 w-3 mr-1" />
          PASS ({attendanceRate}%)
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 hover:bg-red-100"
        >
          <UserX className="h-3 w-3 mr-1" />
          FAIL ({attendanceRate}%)
        </Badge>
      );
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Student ID",
      "Name",
      "Email",
      "Total Sessions",
      "Attended Sessions",
      "Attendance Rate",
      "Status",
    ];
    const csvData = attendance.studentStats.map((student: any) => [
      student.studentId,
      `${student.firstName} ${student.lastName}`,
      "", // Email would need to be added to the student stats
      student.totalSessions,
      student.attendedSessions,
      `${student.attendanceRate}%`,
      student.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row: any) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${course.title}-attendance.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/courses/${courseId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Attendance - {course.title}
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage student attendance for this course
            </p>
          </div>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {course.enrolledCount}
              </p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {course.totalSessions}
              </p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {
                  attendance.studentStats.filter(
                    (s: any) => s.status === "PASS"
                  ).length
                }
              </p>
              <p className="text-sm text-gray-600">Passing Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {
                  attendance.studentStats.filter(
                    (s: any) => s.status === "FAIL"
                  ).length
                }
              </p>
              <p className="text-sm text-gray-600">Failing Students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Students</option>
              <option value="pass">Passing Only</option>
              <option value="fail">Failing Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance</CardTitle>
          <CardDescription>
            {filteredStudents.length} students found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="space-y-4">
              {filteredStudents.map((student: any) => (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {student.firstName.charAt(0)}
                        {student.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        ID: {student.studentId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        {student.attendedSessions}/{student.totalSessions}
                      </p>
                      <p className="text-xs text-gray-600">Sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        {student.attendanceRate}%
                      </p>
                      <p className="text-xs text-gray-600">Rate</p>
                    </div>
                    {getAttendanceBadge(student.attendanceRate)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search terms or filters"
                  : "No students are enrolled in this course yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AttendanceSkeleton = () => (
  <div className="container mx-auto py-8 px-4">
    <div className="flex items-center gap-4 mb-8">
      <Skeleton className="h-8 w-8 rounded" />
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>

    <Skeleton className="h-16 w-full rounded-lg mb-6" />
    <Skeleton className="h-64 w-full rounded-lg" />
  </div>
);

export default StaffAttendancePage;
