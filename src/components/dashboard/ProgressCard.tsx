import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface ProgressCardProps {
  percentage: number;
  date: string;
  trend: {
    value: string;
    description: string;
  };
  title: string;
  items: {
    label: string;
    percentage: number;
  }[];
}

const ProgressCard = ({
  percentage,
  date,
  trend,
  title,
  items,
}: ProgressCardProps) => {
  return (
    <Card className="w-full max-w-md border-border/40 shadow-sm bg-gradient-to-br from-background to-muted/5">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {percentage}%
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {date}
            </p>
          </div>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 px-3 py-1"
          >
            <TrendingUp className="h-3 w-3" />
            {trend.value}
            <span className="text-green-600 ml-1 text-xs">
              {trend.description}
            </span>
          </Badge>
        </div>

        {/* Main Progress Bar */}
        <div className="mb-6">
          <Progress value={percentage} className="h-3 bg-muted/50" />
          <p className="text-sm text-center text-muted-foreground mt-3 font-medium">
            {title}
          </p>
        </div>

        {/* Skills List */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between group hover:bg-muted/30 px-2 py-1 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-foreground flex-1">
                {item.label}
              </span>
              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="w-20 bg-muted/30 rounded-full h-2 overflow-hidden">
                  <Progress
                    value={item.percentage}
                    className="h-2 bg-gradient-to-r from-primary to-primary/70"
                  />
                </div>
                <span className="text-xs font-semibold text-muted-foreground min-w-[2.5rem] text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Summary */}
        <div className="mt-4 pt-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            {items.length} skills • Average:{" "}
            {Math.round(
              items.reduce((sum, item) => sum + item.percentage, 0) /
                items.length
            )}
            %
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
