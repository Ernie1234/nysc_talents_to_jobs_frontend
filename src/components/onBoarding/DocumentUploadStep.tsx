/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/onboarding/steps/DocumentUploadStep.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Upload, FileText, Download } from "lucide-react";

interface DocumentUploadStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  userRole?: string;
  isLastStep: boolean;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>(data.documents || []);

  // Single document requirement based on role (no resume)
  const requiredDocument =
    user?.role === "CORPS_MEMBER" ? "PPA Letter" : "Letter of Request";

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PDF, JPEG, or PNG file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', user?.role === "CORPS_MEMBER" ? "ppa_letter" : "request_letter");
      
      // TODO: Replace with your actual file upload API endpoint
      // const response = await fetch('/api/upload-document', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Authorization': `Bearer ${token}` // Add your auth token
      //   }
      // });
      // const result = await response.json();
      
      // For now, simulate the upload
      const newDoc = {
        fileName: file.name,
        fileUrl: URL.createObjectURL(file), // Replace with actual uploaded URL from backend
        fileType: user?.role === "CORPS_MEMBER" ? "ppa_letter" : "request_letter" as "ppa_letter" | "request_letter",
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };

      setDocuments([newDoc]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    // Ensure uploadedAt is properly formatted
    const formattedDocuments = documents.map((doc) => ({
      ...doc,
      uploadedAt: new Date(doc.uploadedAt).toISOString(),
    }));

    onNext({ documents: formattedDocuments });
  };

  const isComplete = documents.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Upload Required Document</h3>
        <p className="text-sm text-muted-foreground">
          {user?.role === "CORPS_MEMBER"
            ? "Please upload your PPA (Place of Primary Assignment) letter"
            : "Please upload your Letter of Request for SIWES placement"}
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium">{requiredDocument}</h4>
                <p className="text-sm text-muted-foreground">
                  {documents.length > 0 ? "Uploaded" : "Required document"}
                </p>
                {documents.length > 0 && (
                  <p className="text-xs text-green-600">
                    Uploaded:{" "}
                    {new Date(documents[0].uploadedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {documents.length > 0 ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(documents[0].fileUrl, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDocuments([])}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  id="document-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <label htmlFor="document-upload">
                  <Button asChild variant="outline" disabled={uploading}>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload"}
                    </span>
                  </Button>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isComplete || uploading}
          className="bg-green-600 hover:bg-green-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
