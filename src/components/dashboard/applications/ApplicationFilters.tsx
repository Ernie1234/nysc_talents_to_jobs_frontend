// components/dashboard/ApplicationFilters.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ApplicationFiltersProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

const ApplicationFilters = ({
  selectedStatus,
  onStatusChange,
}: ApplicationFiltersProps) => {
  const statusOptions = [
    { value: null, label: "All" },
    { value: "pending", label: "Pending" },
    { value: "under_review", label: "Under Review" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "rejected", label: "Rejected" },
    { value: "hired", label: "Hired" },
    { value: "withdrawn", label: "Withdrawn" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        Filter by status:
      </span>
      {statusOptions.map((option) => (
        <Button
          key={option.value || "all"}
          variant={selectedStatus === option.value ? "primary" : "outline"}
          size="sm"
          onClick={() => onStatusChange(option.value)}
          className="capitalize"
        >
          {option.label}
        </Button>
      ))}

      {selectedStatus && (
        <Badge
          variant="secondary"
          className="cursor-pointer hover:bg-gray-200"
          onClick={() => onStatusChange(null)}
        >
          Clear <X className="h-3 w-3 ml-1" />
        </Badge>
      )}
    </div>
  );
};

export default ApplicationFilters;
