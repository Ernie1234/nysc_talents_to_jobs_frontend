import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProfileCompletionProps } from "@/types/progressCardTypes";
import { Checkbox } from "../ui/checkbox";

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  completionPercentage,
  tasks,
  onTaskToggle,
  onViewAll,
}) => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <Card className="w-full max-w-sm border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-green-800">
          Complete your profile
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          By completing all the details you have a higher chance of being seen
          by recruiters.
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-green-800">
              {completionPercentage}%
            </span>
            <span className="text-sm text-gray-500">
              {completedTasks}/{totalTasks} completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3 mb-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-3 border rounded-lg p-2"
            >
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={(checked) =>
                  onTaskToggle?.(task.id, checked as boolean)
                }
                className="h-5 w-5 rounded border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-primary"
              />
              <label
                htmlFor={task.id}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  task.completed
                    ? "text-gray-500 line-through"
                    : "text-gray-900"
                }`}
              >
                {task.label}
              </label>
              {task.required && (
                <span className="text-xs text-red-500 ml-1">*</span>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        <Button
          variant="ghost"
          className="w-full text-primary hover:text-green-700 hover:bg-green-50 font-medium text-sm"
          onClick={onViewAll}
        >
          View all
        </Button>
      </CardContent>
    </Card>
  );
};
