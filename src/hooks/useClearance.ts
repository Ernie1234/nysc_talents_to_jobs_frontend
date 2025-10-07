/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  useGenerateClearanceMutation,
  useCheckClearanceEligibilityQuery,
} from "@/features/courses/courseAPI";

export const useClearance = (courseId?: string) => {
  const { user } = useAuth();

  const {
    data: eligibilityData,
    isLoading: eligibilityLoading,
    refetch: refetchEligibility,
  } = useCheckClearanceEligibilityQuery(courseId!, {
    skip:
      !courseId ||
      !user ||
      (user.role !== "CORPS_MEMBER" && user.role !== "SIWES"),
  });

  const [generateClearance, { isLoading: generatingClearance }] =
    useGenerateClearanceMutation();

  const handleDownloadClearance = async (courseTitle?: string) => {
    if (!courseId) return false;

    try {
      const response = await generateClearance(courseId).unwrap();

      // Create a blob from the PDF data and trigger download
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `performance-clearance-${courseTitle || "course"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Performance clearance downloaded successfully!");
      return true;
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to download performance clearance"
      );
      return false;
    }
  };

  return {
    eligibility: eligibilityData?.data,
    eligibilityLoading,
    generatingClearance,
    handleDownloadClearance,
    refetchEligibility,
  };
};
