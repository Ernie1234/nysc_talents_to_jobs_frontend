/* eslint-disable @typescript-eslint/no-explicit-any */
// components/findWork/ApplyButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Check, AlertCircle } from "lucide-react";
import { useGetAllUserDocumentQuery } from "@/features/documents/documentsAPI";
import { useGetUserResumesQuery } from "@/features/resumeUpload/resumeUploadAPI";
import { toast } from "sonner";
import { useApplyToJobMutation } from "@/features/job/jobAPI";

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  className?: string;
}

// Use the actual IDocument interface from your API or make it compatible
interface Document {
  documentId: string;
  title: string;
  status: string;
  updatedAt: string;
  themeColor?: string | null; // Make it accept null
  _id: string;
}

interface UploadedResume {
  _id: string;
  originalName: string;
  fileSize: number;
  uploadDate: string;
  status: string;
}

const ApplyButton = ({
  jobId,
  jobTitle,
  companyName,
  className,
}: ApplyButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  // RTK Query hooks
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();
  const { data: documentsData, isLoading: isLoadingDocuments } =
    useGetAllUserDocumentQuery();
  const { data: resumesData, isLoading: isLoadingResumes } =
    useGetUserResumesQuery({});

  // Fix: Type assertion or proper mapping
  const documents: Document[] = (documentsData?.data || []) as Document[];
  const resumes: UploadedResume[] = resumesData?.data || [];

  // Sort documents by updatedAt to get the most recent one
  const sortedDocuments = [...documents].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Get the most recent document (for quick apply)
  const mostRecentDocument = sortedDocuments[0];

  const handleQuickApply = async () => {
    if (!mostRecentDocument) {
      toast.error("No resume found. Please create or upload a resume first.");
      return;
    }

    try {
      console.log("Job Id: ", jobId, mostRecentDocument._id);

      const result = await applyToJob({
        jobId,
        documentId: mostRecentDocument._id,
        coverLetter:
          coverLetter ||
          `I'm interested in the ${jobTitle} position at ${companyName}.`,
      }).unwrap();

      if (result.success) {
        toast.success("Application submitted successfully!");
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error: any) {
      console.error("Application error:", error);
      toast.error(error.data?.message || "Failed to submit application");
    }
  };

  const handleCustomApply = async () => {
    if (!selectedDocumentId && !selectedResumeId) {
      toast.error("Please select a resume to apply with");
      return;
    }

    try {
      const applicationData: any = {
        jobId,
        coverLetter:
          coverLetter ||
          `I'm interested in the ${jobTitle} position at ${companyName}.`,
      };

      if (selectedDocumentId) {
        applicationData.documentId = selectedDocumentId;
      } else if (selectedResumeId) {
        applicationData.resumeUploadId = selectedResumeId;
      }

      const result = await applyToJob(applicationData).unwrap();

      if (result.success) {
        toast.success("Application submitted successfully!");
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error: any) {
      console.error("Application error:", error);
      toast.error(error.data?.message || "Failed to submit application");
    }
  };

  const resetForm = () => {
    setSelectedDocumentId(null);
    setSelectedResumeId(null);
    setCoverLetter("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={className} size="lg">
          Apply Now
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply to {jobTitle}</DialogTitle>
          <CardDescription>
            Apply for the {jobTitle} position at {companyName}
          </CardDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Quick Apply Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Quick Apply
              </CardTitle>
              <CardDescription>
                Apply with your most recent resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mostRecentDocument ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">{mostRecentDocument.title}</p>
                      <p className="text-sm text-gray-500">
                        Updated {formatDate(mostRecentDocument.updatedAt)}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {mostRecentDocument.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder={`I'm interested in the ${jobTitle} position at ${companyName}...`}
                      className="w-full h-24 p-3 border rounded-lg resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleQuickApply}
                    disabled={isApplying}
                    className="w-full"
                  >
                    {isApplying ? "Applying..." : "Quick Apply"}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No resume found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create or upload a resume to apply
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Apply Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Custom Apply
              </CardTitle>
              <CardDescription>
                Choose a specific resume to apply with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Built Resumes */}
              <div className="space-y-3">
                <h4 className="font-semibold">Built Resumes</h4>
                {isLoadingDocuments ? (
                  <div className="text-center py-4">Loading resumes...</div>
                ) : documents.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {documents.map((doc) => (
                      <div
                        key={doc.documentId}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedDocumentId === doc.documentId
                            ? "border-blue-500 bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSelectedDocumentId(doc.documentId);
                          setSelectedResumeId(null);
                        }}
                      >
                        <FileText className="h-6 w-6 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{doc.title}</p>
                          <p className="text-xs text-gray-500">
                            Updated {formatDate(doc.updatedAt)}
                          </p>
                        </div>
                        {selectedDocumentId === doc.documentId && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No built resumes found
                  </div>
                )}
              </div>

              {/* Uploaded Resumes */}
              <div className="space-y-3">
                <h4 className="font-semibold">Uploaded Resumes</h4>
                {isLoadingResumes ? (
                  <div className="text-center py-4">Loading uploads...</div>
                ) : resumes.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {resumes.map((resume) => (
                      <div
                        key={resume._id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedResumeId === resume._id
                            ? "border-blue-500 bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSelectedResumeId(resume._id);
                          setSelectedDocumentId(null);
                        }}
                      >
                        <Upload className="h-6 w-6 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {resume.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded {formatDate(resume.uploadDate)}
                          </p>
                        </div>
                        {selectedResumeId === resume._id && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No uploaded resumes found
                  </div>
                )}
              </div>

              <Button
                onClick={handleCustomApply}
                disabled={
                  isApplying || (!selectedDocumentId && !selectedResumeId)
                }
                className="w-full"
              >
                {isApplying ? "Applying..." : "Apply with Selected Resume"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyButton;
