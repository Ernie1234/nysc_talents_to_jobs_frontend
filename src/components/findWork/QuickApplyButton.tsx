// components/findWork/QuickApplyButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApplyToJobMutation } from "@/features/job/jobAPI";
import { useGetAllUserDocumentQuery } from "@/features/documents/documentsAPI";
import { toast } from "sonner";

interface QuickApplyButtonProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  variant?: "primary" | "outline" | "secondary";
  size?: "sm" | "lg" | "md" | "icon";
}

const QuickApplyButton = ({
  jobId,
  jobTitle,
  companyName,
  variant = "primary",
  size = "sm",
}: QuickApplyButtonProps) => {
  const [isApplying, setIsApplying] = useState(false);
  const [applyToJob] = useApplyToJobMutation();
  const { data: documentsData } = useGetAllUserDocumentQuery();

  const documents = documentsData?.data || [];
  const mostRecentDocument = documents.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )[0];

  const handleQuickApply = async () => {
    if (!mostRecentDocument) {
      toast.error("No resume found. Please create a resume first.");
      return;
    }

    setIsApplying(true);
    try {
      const result = await applyToJob({
        jobId,
        documentId: mostRecentDocument.documentId,
        coverLetter: `I'm interested in the ${jobTitle} position at ${companyName}.`,
      }).unwrap();

      if (result.success) {
        toast.success("Application submitted successfully!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Application error:", error);
      toast.error(error.data?.message || "Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleQuickApply}
      disabled={isApplying}
      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
    >
      {isApplying ? "Applying..." : "Quick Apply"}
    </Button>
  );
};

export default QuickApplyButton;
