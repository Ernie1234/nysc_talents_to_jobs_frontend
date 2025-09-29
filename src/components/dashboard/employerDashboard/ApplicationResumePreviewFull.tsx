// features/applications/components/ResumePreviewModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import type { IResumeDocument } from "@/features/applications/application-types";

interface ResumePreviewModalProps {
  resumeDocument?: IResumeDocument;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationResumePreviewFullModal = ({
  resumeDocument,
  isOpen,
  onClose,
}: ResumePreviewModalProps) => {
  if (!resumeDocument) return null;

  const themeColor = resumeDocument.themeColor || "#2ECC71";

  const handleDownload = () => {
    // Implement download functionality
    console.log("Downloading resume:", resumeDocument._id);
    // You can add your download logic here
    // For example: window.open(`/api/resumes/${resumeDocument._id}/download`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Full Resume Preview</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div
          className="
            shadow-lg bg-white w-full
            p-8 font-open-sans border
          "
          style={{
            borderTop: `13px solid ${themeColor}`,
          }}
        >
          {/* Header with Personal Info */}
          <div className="text-center mb-6">
            <h1
              className="font-bold text-2xl mb-1"
              style={{ color: themeColor }}
            >
              {resumeDocument.authorName || "Candidate Name"}
            </h1>
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              {resumeDocument.title || "Professional Title"}
            </h2>
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <span>{resumeDocument.authorEmail}</span>
            </div>
          </div>

          <hr
            className="border-[1.5px] my-4"
            style={{ borderColor: themeColor }}
          />

          {/* Professional Summary */}
          {resumeDocument.summary && (
            <section className="mb-6">
              <h3
                className="text-lg font-bold mb-2 uppercase"
                style={{ color: themeColor }}
              >
                Professional Summary
              </h3>
              <p className="text-sm leading-relaxed">
                {resumeDocument.summary}
              </p>
            </section>
          )}

          {/* Skills Preview */}
          {resumeDocument.skills && resumeDocument.skills.length > 0 && (
            <section className="mb-6">
              <h3
                className="text-lg font-bold mb-3 uppercase"
                style={{ color: themeColor }}
              >
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {resumeDocument.skills.slice(0, 10).map((skillId, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border"
                  >
                    Skill {index + 1}
                  </span>
                ))}
                {resumeDocument.skills.length > 10 && (
                  <span className="px-3 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                    +{resumeDocument.skills.length - 10} more
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Experience & Education Indicators */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Experience Indicator */}
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <h4
                className="font-semibold text-sm mb-1"
                style={{ color: themeColor }}
              >
                Experience
              </h4>
              <p className="text-2xl font-bold text-gray-700">
                {resumeDocument.experiences?.length || 0}
              </p>
              <p className="text-xs text-gray-500">
                Position{resumeDocument.experiences?.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Education Indicator */}
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <h4
                className="font-semibold text-sm mb-1"
                style={{ color: themeColor }}
              >
                Education
              </h4>
              <p className="text-2xl font-bold text-gray-700">
                {resumeDocument.educations?.length || 0}
              </p>
              <p className="text-xs text-gray-500">
                Institution{resumeDocument.educations?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Resume Metadata */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4
              className="font-semibold text-sm mb-3"
              style={{ color: themeColor }}
            >
              Resume Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-600">Status: </span>
                  <span className="capitalize text-gray-900">
                    {resumeDocument.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Created: </span>
                  <span className="text-gray-900">
                    {new Date(resumeDocument.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-600">
                    Last Updated:{" "}
                  </span>
                  <span className="text-gray-900">
                    {new Date(resumeDocument.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Theme: </span>
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: themeColor }}
                  />
                  <span className="text-gray-900 text-xs">{themeColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
