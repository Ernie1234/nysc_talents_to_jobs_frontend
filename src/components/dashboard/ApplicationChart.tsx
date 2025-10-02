// src/components/dashboard/SkillsChart.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Radar, RadarChart, ResponsiveContainer } from "recharts";

interface Skill {
  name: string;
  level: number;
  _id?: string;
}

interface SkillsRadarChartProps {
  skills: Skill[];
}

const levelLabels = {
  1: "Beginner",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export function SkillsRadarChart({ skills }: SkillsRadarChartProps) {
  // Transform skills data for radar chart
  const chartData = skills.map((skill) => ({
    subject: skill.name,
    level: skill.level,
    fullMark: 5,
    percentage: (skill.level / 5) * 100,
  }));

  const averageSkillLevel =
    skills.length > 0
      ? skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length
      : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Skills Radar</CardTitle>
            <CardDescription>
              Visual representation of your skill levels
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {averageSkillLevel.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Avg. Level</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-col items-center gap-6">
          {/* Radar Chart with shadcn ChartContainer */}
          <div className="w-full h-[300px]">
            <ChartContainer
              config={{
                level: {
                  label: "Skill Level",
                  color: "hsl(142, 76%, 36%)",
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={chartData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelKey="subject"
                        nameKey="level"
                        formatter={(value, name) => {
                          if (name === "level") {
                            const level = Number(value);
                            return [
                              `${level} - ${
                                levelLabels[level as keyof typeof levelLabels]
                              }`,
                              "Level",
                            ];
                          }
                          return [String(value), name];
                        }}
                      />
                    }
                  />
                  <Radar
                    name="level"
                    dataKey="level"
                    stroke="hsl(142, 76%, 36%)"
                    fill="hsl(142, 76%, 36%)"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Skill Summary */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-700">
                {skills.length}
              </div>
              <div className="text-xs text-gray-500">Total Skills</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {Math.round((averageSkillLevel / 5) * 100)}%
              </div>
              <div className="text-xs text-green-600">Avg. Proficiency</div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="w-full">
            <h4 className="text-sm font-semibold mb-3">Top Skills</h4>
            <div className="space-y-2">
              {skills
                .sort((a, b) => b.level - a.level)
                .slice(0, 5)
                .map((skill) => (
                  <div
                    key={skill._id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {skill.level}/5
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
