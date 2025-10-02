import { useAuth } from "@/hooks/useAuth";
import AttendanceScannerPage from "./AttendancePage";
import StaffAttendancePage from "./StaffAttendancePage";

const CourseAttendancePage = () => {
  const { user } = useAuth();
  const isInternUser = user?.role === "CORPS_MEMBER" || user?.role === "SIWES";

  return (
    <>{isInternUser ? <AttendanceScannerPage /> : <StaffAttendancePage />}</>
  );
};

export default CourseAttendancePage;
