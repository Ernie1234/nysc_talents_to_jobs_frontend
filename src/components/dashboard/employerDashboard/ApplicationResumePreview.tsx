// features/applications/components/ApplicationResumePreview.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import type { IResumeDocument } from "@/features/applications/application-types";

interface ApplicationResumePreviewProps {
  resumeDocument?: IResumeDocument;
  isLoading?: boolean;
  onViewFullResume?: () => void;
}

export const ApplicationResumePreview = ({
  resumeDocument,
  isLoading = false,
  onViewFullResume,
}: ApplicationResumePreviewProps) => {
  if (isLoading) {
    return <ResumePreviewSkeleton />;
  }

  if (!resumeDocument) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            No resume document available
          </p>
        </CardContent>
      </Card>
    );
  }

  const themeColor = resumeDocument.themeColor || "#2ECC71";

  const handleDownload = () => {
    // Implement download functionality
    console.log("Downloading resume:", resumeDocument._id);
    // You can add your download logic here
    // For example: window.open(`/api/resumes/${resumeDocument._id}/download`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="
            shadow-lg bg-white w-full
            p-6 font-open-sans border
          "
          style={{
            borderTop: `13px solid ${themeColor}`,
          }}
        >
          {/* Personal Information */}
          <div className="w-full min-h-14">
            <h2
              className="font-bold text-xl text-center"
              style={{ color: themeColor }}
            >
              {resumeDocument.authorName || "Candidate Name"}
            </h2>
            <h5 className="text-center text-sm font-medium">
              {resumeDocument.title || "Professional Title"}
            </h5>

            <hr
              className="border-[1.5px] my-2"
              style={{ borderColor: themeColor }}
            />
          </div>

          {/* Summary */}
          {resumeDocument.summary && (
            <div className="w-full min-h-10 mt-4">
              <h5 className="font-bold mb-2" style={{ color: themeColor }}>
                Professional Summary
              </h5>
              <p className="text-[13px] !leading-4">{resumeDocument.summary}</p>
            </div>
          )}

          {/* Note about detailed sections */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Full resume with detailed experiences,
              education, and skills is available in the candidate's complete
              resume document.
            </p>
          </div>

          {/* Resume Metadata */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Resume Title:</span>
                <p className="text-gray-900">{resumeDocument.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Theme Color:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: themeColor }}
                  />
                  <span className="text-gray-900">{themeColor}</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <p className="text-gray-900">
                  {new Date(resumeDocument.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Last Updated:</span>
                <p className="text-gray-900">
                  {new Date(resumeDocument.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Download/View Actions */}
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </Button>
            <Button
              variant="outline"
              onClick={onViewFullResume}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Full Resume
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Skeleton loader for the resume preview
const ResumePreviewSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="shadow-lg bg-white w-full p-6 border">
          <div className="w-full min-h-14">
            <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto mb-2" />
            <Skeleton className="h-[1.5px] w-full my-2" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationResumePreview;
