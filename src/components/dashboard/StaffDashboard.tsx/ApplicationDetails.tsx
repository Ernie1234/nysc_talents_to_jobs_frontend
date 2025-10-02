import { useState } from "react";
import { ArrowLeft, Mail, Phone, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  useGetApplicationQuery,
  useUpdateApplicationMutation,
} from "@/features/applications/applicationAPI";
import type { ApplicationStatus } from "@/features/applications/application-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatusUpdate } from "./ApplicationStatusUpdate";
import ApplicationResumePreview from "./ApplicationResumePreview";
import { ApplicationResumePreviewFullModal } from "./ApplicationResumePreviewFull";
import { useAuth } from "@/hooks/useAuth";

interface ApplicationDetailsProps {
  applicationId: string;
  onBack: () => void;
}

export const ApplicationDetails = ({
  applicationId,
  onBack,
}: ApplicationDetailsProps) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const { user } = useAuth();

  const {
    data: applicationData,
    isLoading,
    error,
  } = useGetApplicationQuery(applicationId);
  const [updateApplication] = useUpdateApplicationMutation();

  const application = applicationData?.data;

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    try {
      await updateApplication({
        applicationId,
        updates: { status: newStatus },
      }).unwrap();
      setIsEditingStatus(false);
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const handleViewFullResume = () => {
    setIsResumeModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500 text-center py-8">
            <p className="text-lg font-semibold">
              Error loading application details
            </p>
            <Button onClick={onBack} variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </div>
        </div>
      </div>
    );
  }

  console.log("Applicant Data:", application);

  return (
    <div className="min-h-screen bg-gray-50/30 p-5 md:p-0">
      <div className="">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <Button
            variant="outline"
            className="w-fit"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Application Details
            </h1>
            <p className="text-gray-600">
              Review candidate application and manage status
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Information */}
            <Card>
              <CardHeader>
                <CardTitle>Candidate Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-gray-900">
                      {application.user?.fullName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{application.user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Applied For
                    </label>
                    <p className="text-gray-900">{application.job?.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Applied Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            {application.coverLetter && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-green-600">
                      Job Title
                    </label>
                    <p className="text-gray-900">{application.job?.title}</p>
                  </div>
                  {application?.aboutJob && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        About the Job
                      </label>
                      <p className="text-gray-700">{application.aboutJob}</p>
                    </div>
                  )}
                  {application.job?.requirements && (
                    <div>
                      <label className="text-sm font-medium text-green-600">
                        Requirements
                      </label>
                      <p className="text-gray-700">
                        {application.job.requirements}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Resume Preview */}
            <ApplicationResumePreview
              resumeDocument={application.resumeDocument}
              isLoading={isLoading}
              onViewFullResume={handleViewFullResume}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Application Status
                  {user?.role === "ADMIN" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingStatus(!isEditingStatus)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingStatus ? (
                  <ApplicationStatusUpdate
                    currentStatus={application.status as ApplicationStatus}
                    onUpdate={handleStatusUpdate}
                    onCancel={() => setIsEditingStatus(false)}
                  />
                ) : (
                  <div className="space-y-3">
                    <Badge
                      variant="default"
                      className={`text-sm capitalize ${
                        application.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : application.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : application.status === "withdrawn"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {application.status.replace("_", " ")}
                    </Badge>
                    {application.reviewedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Last Reviewed
                        </label>
                        <p className="text-sm text-gray-700">
                          {new Date(
                            application.reviewedAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule Call
                </Button>
                {application.resumeDocument && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleViewFullResume}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    View Full Resume
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Applied</span>
                  <span className="text-gray-900">
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                </div>
                {application.reviewedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Reviewed</span>
                    <span className="text-gray-900">
                      {new Date(application.reviewedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900">
                    {new Date(application.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resume Preview Modal */}
        <ApplicationResumePreviewFullModal
          resumeDocument={application.resumeDocument}
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ApplicationDetails;
