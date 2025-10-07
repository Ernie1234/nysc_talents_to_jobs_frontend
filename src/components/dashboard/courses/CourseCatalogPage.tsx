/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Search, Users, Clock, BookOpen, AlertCircle } from "lucide-react";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useGetPublishedCoursesQuery } from "@/features/courses/courseAPI";

const CourseCatalogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { currentEnrollment, enrollLoading, handleEnroll } = useEnrollment();

  const {
    data: coursesData,
    isLoading,
    error,
    refetch: refetchCourses,
  } = useGetPublishedCoursesQuery({
    search: searchTerm || undefined,
  });

  const courses = coursesData?.data?.courses || [];

  const handleEnrollClick = async (courseId: string, courseTitle: string) => {
    const success = await handleEnroll(courseId, courseTitle);
    if (success) {
      refetchCourses(); // Refresh the course list
    }
  };

  const isEnrolledInCourse = (course: any) => {
    return course.enrolledStudents.some(
      (student: any) => student.id === user?.id
    );
  };

  const canEnroll = (course: any) => {
    // User can enroll if:
    // 1. They are not enrolled in this specific course
    // 2. They don't have any current enrollment
    return !isEnrolledInCourse(course) && !currentEnrollment;
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load courses
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error loading available courses.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Course Catalog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing courses to enhance your skills and advance your
          career
        </p>
      </div>

      {/* Current Enrollment Alert */}
      {currentEnrollment && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You are currently enrolled in{" "}
            <strong>"{currentEnrollment.title}"</strong>. You must drop this
            course before enrolling in a new one.{" "}
            <Button
              variant="outline"
              className="p-0 h-auto text-blue-600 font-semibold"
              onClick={() => navigate(`/courses/${currentEnrollment.id}`)}
            >
              View your current course
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 text-lg"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }, (_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const enrolledInThisCourse = isEnrolledInCourse(course);
            const canEnrollInThisCourse = canEnroll(course);

            return (
              <Card
                key={course._id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={
                      course.coverImage ??
                      (course.coverImage ||
                        "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg")
                    }
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg";
                    }}
                    loading="lazy"
                  />
                </div>

                <CardHeader className={course.coverImage ? "" : "pt-6"}>
                  <CardTitle className="text-xl line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 min-h-[60px]">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} hours total</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolledCount} students enrolled</span>
                    </div>
                    {course.prerequisites.length > 0 && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 mt-0.5" />
                        <div>
                          <span className="font-medium">Prerequisites:</span>
                          <p className="line-clamp-2">
                            {course.prerequisites.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        enrolledInThisCourse
                          ? "default"
                          : !canEnrollInThisCourse
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {enrolledInThisCourse
                        ? "Enrolled"
                        : !canEnrollInThisCourse
                        ? "Already Enrolled Elsewhere"
                        : "Available"}
                    </Badge>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEnrollClick(course._id, course.title);
                      }}
                      disabled={!canEnrollInThisCourse || enrollLoading}
                      size="sm"
                    >
                      {enrollLoading
                        ? "Enrolling..."
                        : enrolledInThisCourse
                        ? "Enrolled"
                        : !canEnrollInThisCourse
                        ? "Already Enrolled"
                        : "Enroll Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 text-lg">
              {searchTerm
                ? "No courses match your search criteria. Try different keywords."
                : "No courses are available at the moment. Please check back later."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const CourseCardSkeleton = () => (
  <Card>
    <Skeleton className="h-48 w-full rounded-t-lg" />
    <CardHeader>
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
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
);

export default CourseCatalogPage;
