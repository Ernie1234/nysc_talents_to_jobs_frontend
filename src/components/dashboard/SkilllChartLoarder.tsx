// preview.tsx (SkeletonLoader)
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkillChartLoader = () => {
  return (
    <Card className="w-full max-w-md border-border/40 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillChartLoader;
