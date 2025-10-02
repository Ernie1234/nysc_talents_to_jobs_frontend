// components/dashboard/ApplicationCard.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  Download,
  Trash2,
  Eye,
} from "lucide-react";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useWithdrawApplicationMutation } from "@/features/applications/applicationAPI";

interface ApplicationCardProps {
  application: {
    id: string;
    jobId: string;
    status: string;
    appliedAt: string;
    job: {
      title: string;
      jobType: string;
      workLocation: string;
      companyName?: string;
      hiringLocation: {
        type: string;
        state?: string;
      };
    };
    staff: {
      firstName: string;
      lastName: string;
      fullName: string;
      companyName?: string;
    };
    resumeDocument?: {
      title: string;
    };
    uploadedResume?: {
      originalName: string;
    };
  };
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawApplication] = useWithdrawApplicationMutation();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "under_review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shortlisted":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "hired":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "withdrawn":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "under_review":
        return "Under Review";
      case "shortlisted":
        return "Shortlisted";
      case "rejected":
        return "Rejected";
      case "hired":
        return "Hired";
      case "withdrawn":
        return "Withdrawn";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const result = await withdrawApplication(application.id).unwrap();
      if (result.success) {
        toast.success("Application withdrawn successfully");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      toast.error(error.data?.message || "Failed to withdraw application");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleViewJob = () => {
    navigate(`/find-work/${application.jobId}`);
  };

  const getCompanyName = () => {
    return (
      application.staff.companyName ||
      `${application.staff.firstName} ${application.staff.lastName}`
    );
  };

  const getLocation = () => {
    if (application.job.hiringLocation.type === "state") {
      return application.job.hiringLocation.state || "Nationwide";
    }
    return "Nationwide";
  };

  const canWithdraw =
    application.status === "pending" || application.status === "under_review";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left Section - Job Details */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3
                  className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={handleViewJob}
                >
                  {application.job.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{getCompanyName()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{getLocation()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Applied {formatDate(application.appliedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge - Mobile */}
              <div className="lg:hidden">
                <Badge className={getStatusColor(application.status)}>
                  {getStatusText(application.status)}
                </Badge>
              </div>
            </div>

            {/* Job Metadata */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {application.job.jobType}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {application.job.workLocation}
              </Badge>
            </div>

            {/* Resume Used */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>
                Applied with:{" "}
                {application.resumeDocument?.title ||
                  application.uploadedResume?.originalName ||
                  "Resume"}
              </span>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex flex-col lg:items-end gap-3">
            {/* Status Badge - Desktop */}
            <div className="hidden lg:block">
              <Badge className={getStatusColor(application.status)}>
                {getStatusText(application.status)}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* View Job Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewJob}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Job
              </Button>

              {/* Download Resume Button */}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  // Add resume download functionality here
                  toast.info("Resume download functionality coming soon");
                }}
              >
                <Download className="h-4 w-4" />
                Resume
              </Button>

              {/* Withdraw Button */}
              {canWithdraw && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={isWithdrawing}
                    >
                      <Trash2 className="h-4 w-4" />
                      Withdraw
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to withdraw your application for{" "}
                        <span className="font-semibold">
                          {application.job.title}
                        </span>{" "}
                        at{" "}
                        <span className="font-semibold">
                          {getCompanyName()}
                        </span>
                        ? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleWithdraw}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isWithdrawing}
                      >
                        {isWithdrawing ? "Withdrawing..." : "Yes, Withdraw"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* Bookmark Button */}
              <Button variant="ghost" size="sm" className="p-2">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
