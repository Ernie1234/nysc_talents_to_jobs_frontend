import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  Target,
  Edit,
  QrCode,
  AlertCircle,
  Download,
  XCircle,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourseQuery } from "@/features/courses/courseAPI";
import { useAuth } from "@/hooks/useAuth";
import { useEnrollment } from "@/hooks/useEnrollment";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useClearance } from "@/hooks/useClearance";

const CourseDetailsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "objectives" | "prerequisites"
  >("overview");
  const {
    currentEnrollment,
    enrollLoading,
    dropLoading,
    handleEnroll,
    handleDrop,
  } = useEnrollment();

  const {
    data: courseData,
    isLoading,
    error,
    refetch,
  } = useGetCourseQuery(courseId!);

  const course = courseData?.data;

  const { eligibility, generatingClearance, handleDownloadClearance } =
    useClearance(courseId);

  if (isLoading) {
    return <CourseDetailsSkeleton />;
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Course Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist or you don't have access
            to it.
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

  const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const enrolledInThisCourse = course.enrolledStudents.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (student: any) => student.id === user?.id
  );

  const canEnrollInThisCourse = !enrolledInThisCourse && !currentEnrollment;

  // Replace the handleEnroll function
  const handleEnrollClick = async () => {
    console.log("course id here: ", course.id, course.title);
    const success = await handleEnroll(course.id, course.title);
    if (success) {
      refetch();
    }
  };

  // Add handleDrop function
  const handleDropClick = async () => {
    const success = await handleDrop(course.id, course.title);
    if (success) {
      refetch();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {course.title}
              </h1>
              <p className="text-gray-600 mt-2">{course.description}</p>
            </div>
            {isStaff && (
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to={`/courses/${course.id}/attendance`}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Attendance
                  </Link>
                </Button>
                <Button asChild>
                  <Link to={`/courses/${course.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Course
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Image */}
          {course.coverImage && (
            <Card>
              <div className="h-64 overflow-hidden rounded-t-lg">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          )}

          {/* Tabs */}
          <Card>
            <CardHeader>
              <div className="flex space-x-4 border-b">
                <button
                  className={`pb-2 px-1 font-medium text-sm ${
                    activeTab === "overview"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`pb-2 px-1 font-medium text-sm ${
                    activeTab === "objectives"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("objectives")}
                >
                  Learning Objectives
                </button>
                <button
                  className={`pb-2 px-1 font-medium text-sm ${
                    activeTab === "prerequisites"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("prerequisites")}
                >
                  Prerequisites
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {activeTab === "overview" && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Duration</p>
                        <p className="text-sm text-gray-600">
                          {course.duration} hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Enrolled Students
                        </p>
                        <p className="text-sm text-gray-600">
                          {course.enrolledCount} students
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "objectives" && (
                <div className="space-y-3">
                  {course.learningObjectives &&
                  course.learningObjectives.length > 0 ? (
                    course.learningObjectives.map(
                      (objective: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                        >
                          <Target className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{objective}</p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No learning objectives specified for this course.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "prerequisites" && (
                <div className="space-y-3">
                  {course.prerequisites && course.prerequisites.length > 0 ? (
                    course.prerequisites.map(
                      (prereq: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg"
                        >
                          <BookOpen className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{prereq}</p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No prerequisites specified for this course.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {!isStaff && (
            <div className="space-y-4">
              {currentEnrollment && currentEnrollment._id !== course.id && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 text-sm">
                    You are currently enrolled in "{currentEnrollment.title}".
                    Drop it first to enroll for
                  </AlertDescription>
                </Alert>
              )}

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
                    ? "Already Enrolled"
                    : "Available"}
                </Badge>

                {enrolledInThisCourse ? (
                  <Button
                    onClick={handleDropClick}
                    disabled={dropLoading}
                    variant="destructive"
                    size="sm"
                  >
                    {dropLoading ? "Dropping..." : "Drop Course"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleEnrollClick}
                    disabled={!canEnrollInThisCourse || enrollLoading}
                    size="sm"
                  >
                    {enrollLoading ? "Enrolling..." : "Enroll Now"}
                  </Button>
                )}
              </div>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge
                  variant={
                    course.status === "published"
                      ? "default"
                      : course.status === "draft"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {course.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium">
                  {course.duration} hours
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Students Enrolled</span>
                <span className="text-sm font-medium">
                  {course.enrolledCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="text-sm font-medium">
                  {course.totalSessions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Attendance Rate</span>
                <span className="text-sm font-medium">
                  {course.attendanceRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium">
                  {formatDate(course.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Instructor Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">
                    {course.staffId?.firstName?.charAt(0)}
                    {course.staffId?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {course.staffId?.firstName} {course.staffId?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {course.staffId?.email}
                  </p>
                  {course.staffId?.staffProfile?.companyName && (
                    <p className="text-sm text-gray-500">
                      {course.staffId.staffProfile.companyName}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Clearance Card */}
          {!isStaff && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Clearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eligibility ? (
                  <>
                    <div
                      className={`flex items-center gap-2 ${
                        eligibility.eligible ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {eligibility.eligible ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span className="font-medium">{eligibility.message}</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>
                        Your Attendance: {eligibility.attendanceRate.toFixed(1)}
                        %
                      </p>
                      <p>Required: {eligibility.requiredRate}%</p>
                    </div>

                    {!eligibility.eligible && (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertDescription className="text-yellow-800 text-sm">
                          You need {eligibility.requiredRate}% attendance to
                          download the performance clearance certificate.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={() => handleDownloadClearance(course.title)}
                      disabled={!eligibility.eligible || generatingClearance}
                      className="w-full"
                      variant={eligibility.eligible ? "primary" : "outline"}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {generatingClearance
                        ? "Generating..."
                        : "Download Clearance"}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Loading eligibility...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions Card */}
          {isStaff && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link to={`/courses/${course.id}/generate-qr`}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/courses/${course.id}/attendance`}>
                    View Attendance
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseDetailsSkeleton = () => (
  <div className="container mx-auto py-8 px-4 max-w-6xl">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="flex-1">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

export default CourseDetailsPage;
