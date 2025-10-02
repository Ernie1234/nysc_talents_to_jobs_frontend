/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Search, Users, Clock, BookOpen } from "lucide-react";

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
import { toast } from "sonner";
import {
  useEnrollCourseMutation,
  useGetPublishedCoursesQuery,
} from "@/features/courses/courseAPI";
import { useNavigate } from "react-router-dom";

const CourseCatalogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollCourse, { isLoading: enrollLoading }] =
    useEnrollCourseMutation();

  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useGetPublishedCoursesQuery({
    search: searchTerm || undefined,
  });

  const courses = coursesData?.data?.courses || [];

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error("Please log in to enroll in courses");
      return;
    }

    try {
      await enrollCourse(courseId).unwrap();
      toast.success("Successfully enrolled in course!");
      refetch(); // Refresh the course list
    } catch (error: any) {
      console.error("Enroll error:", error);
      toast.error(error?.data?.message || "Failed to enroll in course");
    }
  };

  const isEnrolled = (course: any) => {
    return course.enrolledStudents.some(
      (student: any) => student.id === user?.id
    );
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
            const enrolled = isEnrolled(course);

            return (
              <Card
                key={course._id}
                className="hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(`/courses/${course._id}/attendance`)}
              >
                {course.coverImage && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
                    <Badge variant={enrolled ? "default" : "secondary"}>
                      {enrolled ? "Enrolled" : "Available"}
                    </Badge>
                    <Button
                      onClick={() => handleEnroll(course._id)}
                      disabled={enrolled || enrollLoading}
                      size="sm"
                    >
                      {enrollLoading
                        ? "Enrolling..."
                        : enrolled
                        ? "Enrolled"
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
