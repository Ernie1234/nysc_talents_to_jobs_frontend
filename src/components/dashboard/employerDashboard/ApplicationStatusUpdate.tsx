// features/application/ApplicationStatusUpdate.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/features/applications/application-types";

interface ApplicationStatusUpdateProps {
  currentStatus: ApplicationStatus;
  onUpdate: (status: ApplicationStatus) => void;
  onCancel: () => void;
}

const statusOptions: {
  value: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "under_review",
    label: "Under Review",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "shortlisted",
    label: "Shortlisted",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "interview",
    label: "Interview",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "accepted",
    label: "Accepted",
    color: "bg-emerald-100 text-emerald-800",
  },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  {
    value: "withdrawn",
    label: "Withdrawn",
    color: "bg-gray-100 text-gray-800",
  },
];

export const ApplicationStatusUpdate = ({
  currentStatus,
  onUpdate,
  onCancel,
}: ApplicationStatusUpdateProps) => {
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus>(currentStatus);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {statusOptions.map((status) => (
          <Badge
            key={status.value}
            variant={selectedStatus === status.value ? "default" : "outline"}
            className={`cursor-pointer text-xs capitalize ${status.color} ${
              selectedStatus === status.value ? "ring-2 ring-offset-1" : ""
            }`}
            onClick={() => setSelectedStatus(status.value)}
          >
            {status.label}
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onUpdate(selectedStatus)}
          disabled={selectedStatus === currentStatus}
        >
          Update Status
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
