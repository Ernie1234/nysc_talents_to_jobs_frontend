/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusData = [
  { status: "pending", count: 186, color: "hsl(45, 93%, 47%)" },
  { status: "in review", count: 305, color: "hsl(217, 91%, 60%)" },
  { status: "interview", count: 237, color: "hsl(262, 83%, 58%)" },
  { status: "processing", count: 173, color: "hsl(142, 76%, 36%)" },
  { status: "accepted", count: 209, color: "hsl(142, 72%, 29%)" },
  { status: "rejected", count: 142, color: "hsl(0, 84%, 60%)" },
];

const statusLabels = {
  pending: "Pending",
  "in review": "In Review",
  interview: "Interview",
  processing: "Processing",
  accepted: "Accepted",
  rejected: "Rejected",
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = (
      (data.count / statusData.reduce((sum, item) => sum + item.count, 0)) *
      100
    ).toFixed(1);

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">
          {statusLabels[data.status as keyof typeof statusLabels]}
        </p>
        <p className="text-sm text-gray-600">Count: {data.count}</p>
        <p className="text-sm text-gray-600">Percentage: {percentage}%</p>
      </div>
    );
  }
  return null;
};

export function ApplicationChart() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const totalApplications = statusData.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const activeData = statusData[activeIndex];
  const acceptedCount =
    statusData.find((item) => item.status === "accepted")?.count || 0;
  const rejectedCount =
    statusData.find((item) => item.status === "rejected")?.count || 0;
  const successRate =
    totalApplications > 0
      ? ((acceptedCount / totalApplications) * 100).toFixed(1)
      : "0";

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Total applications: {totalApplications.toLocaleString()}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {successRate}%
            </div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="status"
                  onMouseEnter={onPieEnter}
                  //   activeIndex={activeIndex}
                  activeShape={(props: any) => {
                    const { cx, cy, outerRadius, startAngle, endAngle, fill } =
                      props;
                    return (
                      <g>
                        <path
                          d={`
                            M ${cx},${cy}
                            L ${
                              cx +
                              Math.cos((startAngle * Math.PI) / 180) *
                                outerRadius
                            },${
                            cy +
                            Math.sin((startAngle * Math.PI) / 180) * outerRadius
                          }
                            A ${outerRadius},${outerRadius} 0 0,1 ${
                            cx +
                            Math.cos((endAngle * Math.PI) / 180) * outerRadius
                          },${
                            cy +
                            Math.sin((endAngle * Math.PI) / 180) * outerRadius
                          }
                            Z
                          `}
                          fill={fill}
                        />
                        <text
                          x={cx}
                          y={cy}
                          dy={-10}
                          textAnchor="middle"
                          fill="#333"
                          className="font-bold text-lg"
                        >
                          {activeData.count}
                        </text>
                        <text
                          x={cx}
                          y={cy}
                          dy={10}
                          textAnchor="middle"
                          fill="#666"
                          className="text-sm"
                        >
                          {
                            statusLabels[
                              activeData.status as keyof typeof statusLabels
                            ]
                          }
                        </text>
                      </g>
                    );
                  }}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {acceptedCount}
              </div>
              <div className="text-xs text-green-600">Accepted</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {rejectedCount}
              </div>
              <div className="text-xs text-red-600">Rejected</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalApplications - acceptedCount - rejectedCount}
              </div>
              <div className="text-xs text-blue-600">In Progress</div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {statusData.map((item) => (
              <div
                key={item.status}
                className="flex items-center gap-2 text-sm p-2"
              >
                <span
                  className="w-3 h-3 rounded-xs flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium flex-1">
                  {statusLabels[item.status as keyof typeof statusLabels]}
                </span>
                <span className="text-muted-foreground font-semibold">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
