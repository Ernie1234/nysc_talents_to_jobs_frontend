import type { Activity } from "@/types/recentActivitiesType";
import { formatTimeAgo } from "@/lib/timeUtils";
import { cn } from "@/lib/utils";

interface ActivityItemProps {
  activity: Activity;
  index: number; // Add index prop to determine even/odd
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  index,
}) => {
  const hasBackground = index % 2 === 0; // Even indexes (0, 2, 4...) get background

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 p-2 rounded transition-colors duration-150 hover:bg-primary/12",
        hasBackground && "bg-primary/5 "
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1 gap-2">
          {activity.title && (
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-shrink-0">
              {activity.title}
            </h4>
          )}
          <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
            {formatTimeAgo(activity.createdAt)}
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-tight">
          {activity.subtitle}
        </p>
      </div>
    </div>
  );
};
