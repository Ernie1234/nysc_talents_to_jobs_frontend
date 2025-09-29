import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Archive,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import type { CreateJobRequest, IJob } from "@/features/job/jobTypes";
import {
  useDeleteJobMutation,
  useUpdateJobMutation,
} from "@/features/job/jobAPI";

// Using IJob directly for consistency and full type safety
interface JobManagementDialogProps {
  job: IJob;
}

const JobManagementDialog = ({ job }: JobManagementDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Use the actual job status as the initial selected status
  const [selectedStatus, setSelectedStatus] = useState<IJob["status"]>(
    job.status
  );

  const [updateJobStatus, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  // Helper type for status
  type JobStatus = IJob["status"];

  const handleStatusChange = async (newStatus: string) => {
    const statusToUpdate = newStatus as JobStatus;

    // Check if status is actually changing
    if (statusToUpdate === selectedStatus || isUpdating) return;

    try {
      // FIX: The status update must be correctly nested inside the 'updates' object
      await updateJobStatus({
        jobId: job.id,
        updates: {
          status: statusToUpdate,
        } as Partial<CreateJobRequest>, // Cast to satisfy Partial<CreateJobRequest>
      }).unwrap();

      setSelectedStatus(statusToUpdate);
      toast.success("Status Updated", {
        description: `Job status changed to ${
          statusToUpdate.charAt(0).toUpperCase() + statusToUpdate.slice(1)
        }`,
      });
      // Close dialog for major status changes (publish, close, archive)
      if (statusToUpdate !== "draft") {
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update job status. Check console for details.",
      });
      console.error("Update Job Status Error:", error);
    }
  };

  const handleDeleteJob = async () => {
    // NOTE: Removed the prohibited 'confirm()' call. A confirmation UI should precede this.

    setIsDeleting(true);
    try {
      await deleteJob(job.id).unwrap();
      toast.success("Job Deleted", {
        description: `The job titled '${job.title}' has been deleted successfully.`,
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete job. Check console for details.",
      });
      console.error("Delete Job Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: JobStatus | string) => {
    switch (status) {
      case "published":
        return "text-green-600 bg-green-100";
      case "draft":
        return "text-yellow-600 bg-yellow-100";
      case "closed":
        return "text-red-600 bg-red-100";
      case "archived":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: JobStatus | string) => {
    switch (status) {
      case "published":
        return <Eye className="w-4 h-4" />;
      case "draft":
        return <Edit className="w-4 h-4" />;
      case "closed":
        return <Archive className="w-4 h-4" />;
      case "archived":
        return <Archive className="w-4 h-4" />;
      default:
        return <Edit className="w-4 h-4" />;
    }
  };

  const availableStatuses: JobStatus[] = [
    "draft",
    "published",
    "closed",
    "archived",
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
            aria-label="Manage Job"
            disabled={isDeleting || isUpdating}
          >
            {isDeleting || isUpdating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MoreHorizontal className="w-5 h-5" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DialogTrigger asChild>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Manage Status
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          {/* Link to Edit Page - Assuming /edit-job/:id exists */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={`/edit-job/${job.id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
            onClick={handleDeleteJob}
            disabled={isDeleting || isUpdating}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {isDeleting ? "Deleting..." : "Delete Job"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Job</DialogTitle>
          <DialogDescription>
            Update the status and manage **{job.title}**
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Information */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">{job.title}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{job.jobType}</span>
              <span>•</span>
              {/* Using workLocation from IJob */}
              <span>{job.workLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Current Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                  selectedStatus
                )}`}
              >
                {getStatusIcon(selectedStatus)}
                {selectedStatus.charAt(0).toUpperCase() +
                  selectedStatus.slice(1)}
              </span>
            </div>
          </div>

          {/* Status Update */}
          <div className="space-y-3">
            <Label htmlFor="status-select">Update Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={handleStatusChange}
              disabled={isUpdating || isDeleting}
            >
              <SelectTrigger id="status-select">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              • <strong>Draft:</strong> Job is saved but not visible to
              applicants
              <br />• <strong>Published:</strong> Job is live and accepting
              applications
              <br />• <strong>Closed:</strong> Job is no longer accepting
              applications
              <br />• <strong>Archived:</strong> Job is moved to archive for
              record-keeping
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Label>Quick Actions</Label>
            <div className="flex gap-2 flex-wrap">
              {/* Publish Action */}
              {selectedStatus === "draft" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("published")}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isUpdating || isDeleting}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4 mr-1" />
                  )}
                  {"Publish Now"}
                </Button>
              )}
              {/* Close Action */}
              {selectedStatus === "published" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("closed")}
                  disabled={isUpdating || isDeleting}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Archive className="w-4 h-4 mr-1" />
                  )}
                  {"Close Job"}
                </Button>
              )}
              {/* Archive Action (from published/closed) */}
              {(selectedStatus === "published" ||
                selectedStatus === "closed") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("archived")}
                  disabled={isUpdating || isDeleting}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Archive className="w-4 h-4 mr-1" />
                  )}
                  {"Archive Job"}
                </Button>
              )}
            </div>
          </div>

          {/* Permanent Delete Button within the Dialog for visibility */}
          <div className="border-t pt-4 mt-4 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteJob}
              className="text-red-600 border-red-200 hover:bg-red-50"
              disabled={isDeleting || isUpdating}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1" />
              )}
              {isDeleting ? "Deleting Permanently..." : "Delete Permanently"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobManagementDialog;
