import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useDeleteResumeMutation,
  useGetUserResumesQuery,
  useUploadResumeMutation,
  useDownloadResumeMutation,
} from "@/features/resumeUpload/resumeUploadAPI";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UploadedFile {
  _id: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  uploadDate: string;
  status: "completed" | "uploading" | "error";
}

const UploadResume = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [localUploads, setLocalUploads] = useState<
    { id: string; file: File; progress: number }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Query hooks
  const [uploadResume] = useUploadResumeMutation();
  const [deleteResume] = useDeleteResumeMutation();
  const [downloadResume] = useDownloadResumeMutation();
  const { data: resumesData, isLoading, refetch } = useGetUserResumesQuery({});

  const resumes: UploadedFile[] = resumesData?.data || [];

  // Supported file types
  const supportedFormats = [".pdf", ".doc", ".docx", ".txt"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter((file) => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidFormat = supportedFormats.includes(fileExtension);
      const isValidSize = file.size <= maxFileSize;

      if (!isValidFormat) {
        toast.error(
          `Unsupported format: ${file.name}. Supported formats: PDF, DOC, DOCX, TXT`
        );
        return false;
      }

      if (!isValidSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      await startUpload(validFiles);
    }
  };

  const startUpload = async (files: File[]) => {
    for (const file of files) {
      const localId = Math.random().toString(36).substr(2, 9);

      // Add to local uploads for progress tracking
      setLocalUploads((prev) => [...prev, { id: localId, file, progress: 0 }]);

      try {
        const formData = new FormData();
        formData.append("resume", file);

        // Update progress
        setLocalUploads((prev) =>
          prev.map((upload) =>
            upload.id === localId ? { ...upload, progress: 50 } : upload
          )
        );

        const result = await uploadResume(formData).unwrap();

        if (result.success) {
          toast.success(`Successfully uploaded: ${file.name}`);
          // Refetch the resumes list
          refetch();
        } else {
          throw new Error(result.message || "Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload: ${file.name}`);
      } finally {
        // Remove from local uploads
        setLocalUploads((prev) =>
          prev.filter((upload) => upload.id !== localId)
        );
      }
    }
  };

  // No changes here, just for context
  const handleDeleteResume = async (resumeId: string, resumeName: string) => {
    try {
      const result = await deleteResume(resumeId).unwrap();
      if (result.success) {
        toast.success(resumeName, {
          description: "Resume deleted successfully",
        });
        refetch();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete resume");
    }
  };

  // Replace the old handleDownloadResume function with this
  const handleDownloadResume = async (resumeId: string, resumeName: string) => {
    try {
      // The useDownloadResumeMutation hook is a mutation, so we await the result
      const blob = await downloadResume(resumeId).unwrap();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", resumeName); // Set the filename for download
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up: remove the temporary link and revoke the URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Started download for ${resumeName}`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error(`Failed to download: ${resumeName}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "txt":
        return "📃";
      default:
        return "📎";
    }
  };

  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card
        className={`border-2 border-dashed ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } transition-colors`}
      >
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center justify-center py-8 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Your Resume
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your resume here, or click to browse
            </p>
            <Button
              onClick={openFileInput}
              disabled={localUploads.length > 0}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Choose Files
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, TXT • Max size: 5MB
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center">Loading your resumes...</div>
          </CardContent>
        </Card>
      )}

      {/* Active Uploads */}
      {localUploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Uploading Files</h4>
          {localUploads.map((upload) => (
            <Card key={upload.id} className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">
                      {getFileIcon(upload.file.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate">
                        {upload.file.name}
                      </span>
                      <Progress value={upload.progress} className="mt-2" />
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    Uploading...
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Uploaded Resumes List */}
      {resumes.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Your Resumes</h4>
          {resumes.map((resume) => (
            <Card key={resume._id} className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">
                      {getFileIcon(resume.originalName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {resume.originalName}
                        </span>
                        <Badge variant="default" className="capitalize">
                          {resume.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatFileSize(resume.fileSize)}</span>
                        <span>•</span>
                        <span>
                          {new Date(resume.uploadDate).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="uppercase">{resume.fileType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        handleDownloadResume(resume._id, resume.originalName)
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your resume:
                            <span className="font-semibold text-gray-800">
                              {" "}
                              {resume.originalName}
                            </span>
                            .
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteResume(
                                resume._id,
                                resume.originalName
                              )
                            }
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {resumes.length === 0 && !isLoading && localUploads.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">
              No resumes uploaded yet
            </h4>
            <p className="text-gray-600">
              Upload your first resume to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadResume;
