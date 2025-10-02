import CourseCatalogPage from "@/components/dashboard/courses/CourseCatalogPage";
import StaffCoursesPage from "@/components/dashboard/courses/StaffCoursesPage";
import { useAuth } from "@/hooks/useAuth";

const CourseHomePage = () => {
  const { user } = useAuth();
  const isInternUser = user?.role === "CORPS_MEMBER" || user?.role === "SIWES";
  //   const isStaffUser = user?.role === "STAFF";

  return <>{isInternUser ? <CourseCatalogPage /> : <StaffCoursesPage />}</>;
};

export default CourseHomePage;
