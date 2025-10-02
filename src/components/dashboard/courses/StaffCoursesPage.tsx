/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Users, Clock, Calendar } from "lucide-react";

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
import { useAuth } from "@/hooks/useAuth";
import { useGetStaffCoursesQuery } from "@/features/courses/courseAPI";

const StaffCoursesPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: coursesData,
    isLoading,
    error,
    isError,
  } = useGetStaffCoursesQuery({
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  // Debug: Log the API response
  useEffect(() => {
    console.log("Courses API Response:", coursesData);
    console.log("Error:", error);
    console.log("Is Error:", isError);
  }, [coursesData, error, isError]);

  const courses = coursesData?.data?.courses || [];

  // Safe course data extraction
  const getCourseData = (course: any) => {
    return {
      id: course.id || course._id,
      title: course.title || "Untitled Course",
      description: course.description || "No description available",
      duration: course.duration || 0,
      status: course.status || "draft",
      enrolledCount: course.enrolledCount || 0,
      createdAt: course.createdAt || new Date().toISOString(),
      coverImage: course.coverImage,
      staffId: course.staffId,
    };
  };

  if (!user || (user.role !== "STAFF" && user.role !== "ADMIN")) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600">
            Only staff members can access this page.
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Draft", variant: "secondary" as const },
      published: { label: "Published", variant: "default" as const },
      archived: { label: "Archived", variant: "outline" as const },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.log(error);
      return "Invalid date";
    }
  };

  // Show detailed error information
  if (isError) {
    console.error("Detailed API Error:", error);

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load courses
          </h3>
          <p className="text-gray-600 mb-2">
            There was an error loading your courses.
          </p>
          <div className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
            {error && (
              <details className="cursor-pointer">
                <summary className="text-blue-600 hover:text-blue-800">
                  Show error details
                </summary>
                <pre className="text-left mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <Button asChild variant="outline">
              <Link to="/courses/create-course">Create Course Anyway</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log("Rendering courses:", courses, coursesData);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your created courses
          </p>
        </div>
        <Button asChild>
          <Link to="/courses/create-course">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
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
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      {!isLoading && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Found {courses.length} courses (Total:{" "}
            {coursesData?.data?.total || 0})
          </p>
        </div>
      )}

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => {
            const courseData = getCourseData(course);

            return (
              <Card
                key={courseData.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={
                      courseData.coverImage ||
                      "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg"
                    }
                    alt={courseData.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardHeader
                  className={courseData.coverImage ? "pb-3" : "pb-3 pt-6"}
                >
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {courseData.title}
                    </CardTitle>
                    {getStatusBadge(courseData.status)}
                  </div>
                  <CardDescription className="line-clamp-3 max-h-[60px] max-w-prose truncate text-wrap">
                    {courseData.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{courseData.duration} hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{courseData.enrolledCount} enrolled</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDate(courseData.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link to={`/courses/${courseData.id}`}>View</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link to={`/courses/${courseData.id}/attendance`}>
                        Attendance
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search terms or filters"
                : "Get started by creating your first course"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button asChild>
                <Link to="/create-course">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CourseCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-3">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3 mb-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </CardContent>
  </Card>
);

export default StaffCoursesPage;
