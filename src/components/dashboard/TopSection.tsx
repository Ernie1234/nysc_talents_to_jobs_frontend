import { useResumeContext } from "@/context/resume-info-provider";
import { AlertCircle } from "lucide-react";
import { useCallback } from "react";
import ResumeTitle from "./resume/ResumeTitle";
import Download from "./Download";
import Share from "./Share";
import MoreOption from "./MoreOption";
import ThemeColor from "./ThemeColor";
import useUpdateDocument from "@/hooks/use-update-document";
import { toast } from "sonner";
import PreviewModal from "./PreviewModal";

const TopSection = () => {
  const { resumeInfo, isLoading, onUpdate, isSuccess } = useResumeContext();
  const { mutateAsync, isLoading: isPending } = useUpdateDocument();

  // Add debug logging
  console.log("TopSection - resumeInfo:", resumeInfo);
  console.log("TopSection - isLoading:", isLoading);
  console.log("TopSection - isSuccess:", isSuccess);
  console.log("TopSection - resumeInfo type:", typeof resumeInfo);

  const handleTitle = useCallback(
    (title: string) => {
      if (title === "Untitled Resume" && !title) return;

      if (resumeInfo) {
        onUpdate({
          ...resumeInfo,
          title: title,
        });
      }

      mutateAsync(
        {
          title: title,
        },
        {
          onSuccess: () => {
            toast.success("Success", {
              description: "Title updated successfully",
            });
          },
          onError: () => {
            toast.error("Error", {
              description: "Failed to update the title",
            });
          },
        }
      );
    },
    [resumeInfo, onUpdate]
  );

  console.log(`Rendering TopSection component: ${JSON.stringify(resumeInfo)}`);
  return (
    <>
      {resumeInfo?.status === "archived" && (
        <div
          className="
            absolute z-[9] inset-0 h-6 top-0
            bg-rose-500 text-center
            text-base p-2 text-white
            flex items-center gap-x-2 
            justify-center font-medium

            "
        >
          <AlertCircle size="16px" />
          This resume is in the trash bin
        </div>
      )}
      <div
        className="
          w-full flex items-center justify-between
          border-b pb-3
          "
      >
        <div className="flex items-center gap-2">
          <ResumeTitle
            isLoading={isLoading || isPending}
            initialTitle={resumeInfo?.title || ""}
            status={resumeInfo?.status}
            onSave={(value) => handleTitle(value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* {ThemeColor} */}
          <ThemeColor />

          {/* Preview Modal */}
          <PreviewModal />

          {/* Download Resume */}
          <Download
            title={resumeInfo?.title || "Unititled Resume"}
            status={resumeInfo?.status}
            isLoading={isLoading}
          />

          {/* Share Resume */}
          <Share />

          {/* More Option */}
          <MoreOption />
        </div>
      </div>
    </>
  );
};

export default TopSection;
