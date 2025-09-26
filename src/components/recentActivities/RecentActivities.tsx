import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityItem } from "./ActivityItem";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader, History } from "lucide-react";
import type {
  Activity,
  RecentActivitiesProps,
} from "@/types/recentActivitiesType";
import { generateMockActivities } from "@/lib/mockData";

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities: externalActivities,
  onLoadMore,
  isLoading: externalLoading,
  hasMore: externalHasMore,
}) => {
  const [internalActivities, setInternalActivities] = useState<Activity[]>([]);
  const [isInternalLoading, setIsInternalLoading] = useState(false);
  const [internalHasMore, setInternalHasMore] = useState(true);

  // Use external props if provided, otherwise use internal state
  const activities = externalActivities || internalActivities;
  const isLoading =
    externalLoading !== undefined ? externalLoading : isInternalLoading;
  const hasMore =
    externalHasMore !== undefined ? externalHasMore : internalHasMore;

  const loadMoreActivities = useCallback(async () => {
    if (isLoading || !hasMore) return;

    if (onLoadMore) {
      // Use external load more function if provided
      await onLoadMore();
    } else {
      // Internal mock data loading
      setIsInternalLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newActivities = generateMockActivities(5);
      setInternalActivities((prev) => [...prev, ...newActivities]);

      // Stop loading after 25 items for demo
      if (internalActivities.length + newActivities.length >= 25) {
        setInternalHasMore(false);
      }

      setIsInternalLoading(false);
    }
  }, [isLoading, hasMore, onLoadMore, internalActivities.length]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      // Load more when near bottom (90% scrolled)
      if (
        scrollHeight - scrollTop <= clientHeight * 1.1 &&
        !isLoading &&
        hasMore
      ) {
        loadMoreActivities();
      }
    },
    [isLoading, hasMore, loadMoreActivities]
  );

  const refreshActivities = useCallback(async () => {
    if (onLoadMore) {
      // If using external data, just reload the first page
      window.scrollTo(0, 0);
    } else {
      // Internal refresh
      setIsInternalLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newActivities = generateMockActivities(8);
      setInternalActivities(newActivities);
      setInternalHasMore(true);
      setIsInternalLoading(false);
    }
  }, [onLoadMore]);

  // Load initial activities if using internal state and no activities provided
  useEffect(() => {
    if (!externalActivities && internalActivities.length === 0) {
      refreshActivities();
    }
  }, [externalActivities, internalActivities.length, refreshActivities]);

  return (
    <Card className="w-full max-w-md px-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <History className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <CardDescription>
                Latest updates and notifications
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshActivities}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-fit" onScroll={handleScroll}>
          <div className="pr-4 space-y-2">
            {activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                index={index}
              />
            ))}

            {isLoading && (
              <div className="flex justify-center py-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Loading activities...</span>
                </div>
              </div>
            )}

            {!hasMore && activities.length > 0 && (
              <div className="text-center py-6 border-t">
                <p className="text-sm text-gray-500">You're all caught up!</p>
                <p className="text-xs text-gray-400 mt-1">
                  No more activities to show
                </p>
              </div>
            )}

            {activities.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No activities yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Activities will appear here as they happen
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
