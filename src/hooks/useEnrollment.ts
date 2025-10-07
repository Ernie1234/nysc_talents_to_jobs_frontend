/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  useEnrollCourseMutation,
  useDropCourseMutation,
  useGetCurrentEnrollmentQuery,
} from "@/features/courses/courseAPI";

export const useEnrollment = () => {
  const { user } = useAuth();
  const { data: currentEnrollment, refetch: refetchEnrollment } =
    useGetCurrentEnrollmentQuery(undefined, {
      skip: !user || (user.role !== "CORPS_MEMBER" && user.role !== "SIWES"),
    });

  const [enrollCourse, { isLoading: enrollLoading }] =
    useEnrollCourseMutation();
  const [dropCourse, { isLoading: dropLoading }] = useDropCourseMutation();

  const handleEnroll = async (courseId: string, courseTitle?: string) => {
    if (!user) {
      toast.error("Please log in to enroll in courses");
      return false;
    }

    // Check if already enrolled in another course
    if (currentEnrollment?.data) {
      toast.error(
        `You are already enrolled in "${currentEnrollment.data.title}". Please drop it first to enroll in a new course.`
      );
      return false;
    }

    try {
      await enrollCourse(courseId).unwrap();
      await refetchEnrollment();
      toast.success(`Successfully enrolled in ${courseTitle || "the course"}!`);
      return true;
    } catch (error: any) {
      console.error("Enroll error:", error);
      toast.error(error?.data?.message || "Failed to enroll in course");
      return false;
    }
  };

  const handleDrop = async (courseId: string, courseTitle?: string) => {
    if (!user) {
      toast.error("Please log in to drop courses");
      return false;
    }

    try {
      await dropCourse(courseId).unwrap();
      await refetchEnrollment();
      toast.success(`Successfully dropped ${courseTitle || "the course"}`);
      return true;
    } catch (error: any) {
      console.error("Drop error:", error);
      toast.error(error?.data?.message || "Failed to drop course");
      return false;
    }
  };

  return {
    currentEnrollment: currentEnrollment?.data || null,
    enrollLoading,
    dropLoading,
    handleEnroll,
    handleDrop,
    refetchEnrollment,
  };
};
