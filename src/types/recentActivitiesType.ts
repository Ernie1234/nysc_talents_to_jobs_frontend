export interface Activity {
  id: string;
  title?: string;
  subtitle: string; // Required
  createdAt: Date;
  updatedAt: Date;
  variant?: "default" | "success" | "warning" | "error";
}

export interface RecentActivitiesProps {
  activities?: Activity[];
  onLoadMore?: () => Promise<void>;
  isLoading?: boolean;
  hasMore?: boolean;
}
