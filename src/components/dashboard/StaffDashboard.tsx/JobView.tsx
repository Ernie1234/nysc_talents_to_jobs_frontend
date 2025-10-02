/* eslint-disable @typescript-eslint/no-explicit-any */
// JobView.tsx
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface JobViewProps {
  analysisData?: {
    jobs: Array<{
      jobId: string;
      title: string;
      status: string;
      applicationCount: number;
      viewCount: number;
      shortlistedCount: number;
      acceptedCount: number;
      createdAt: string;
      publishedAt?: string;
    }>;
    totalViews: number;
  };
}

// Generate the last 6 months dynamically
const getLastSixMonths = () => {
  const months = [];
  const date = new Date();

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
    const monthName = monthDate.toLocaleString("default", { month: "short" });
    months.push(monthName);
  }

  return months;
};

// Generate chart data from the analysis data
const generateChartData = (jobs: any[]) => {
  const lastSixMonths = getLastSixMonths();

  if (!jobs || jobs.length === 0) {
    return lastSixMonths.map((month) => ({
      month,
      views: 0,
      applications: 0,
    }));
  }

  // Group by month and calculate totals
  const monthlyData: {
    [key: string]: { views: number; applications: number };
  } = {};

  // Initialize all months with zeros
  lastSixMonths.forEach((month) => {
    monthlyData[month] = { views: 0, applications: 0 };
  });

  // Fill in actual data
  jobs.forEach((job) => {
    const date = new Date(job.createdAt);
    const month = date.toLocaleString("default", { month: "short" });

    // Only include data for the last 6 months
    if (lastSixMonths.includes(month)) {
      monthlyData[month].views += job.viewCount || 0;
      monthlyData[month].applications += job.applicationCount || 0;
    }
  });

  // Convert to array format for Recharts
  return lastSixMonths.map((month) => ({
    month,
    views: monthlyData[month]?.views || 0,
    applications: monthlyData[month]?.applications || 0,
  }));
};

const chartConfig = {
  views: {
    label: "Job Views",
    color: "var(--chart-1)",
  },
  applications: {
    label: "Applications",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function JobView({ analysisData }: JobViewProps) {
  const chartData = generateChartData(analysisData?.jobs || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-green-800">
          Job Performance
        </CardTitle>
        <CardDescription>
          Views and applications over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="views"
              type="natural"
              fill="var(--color-views)"
              fillOpacity={0.4}
              stroke="var(--color-views)"
              stackId="1"
            />
            <Area
              dataKey="applications"
              type="natural"
              fill="var(--color-applications)"
              fillOpacity={0.4}
              stroke="var(--color-applications)"
              stackId="1"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
