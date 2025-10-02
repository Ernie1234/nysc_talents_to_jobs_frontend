// src/components/dashboard/StatusTracking.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface StatusTrackingProps {
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "SUSPENDED";
  userRole?: "CORPS_MEMBER" | "SIWES" | "STAFF" | "ADMIN";
}

export const StatusTracking: React.FC<StatusTrackingProps> = ({
  status,
  userRole = "CORPS_MEMBER",
}) => {
  const { user } = useAuth();

  const statusConfig = {
    PENDING: {
      icon: Clock,
      label: "Under Review",
      description: "Your application is being reviewed by our team",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      badgeColor: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      progress: 25,
    },
    ACCEPTED: {
      icon: CheckCircle,
      label: "Accepted",
      description: "Your application has been approved!",
      color: "text-green-600 bg-green-50 border-green-200",
      badgeColor: "bg-green-100 text-green-800 hover:bg-green-100",
      progress: 100,
    },
    REJECTED: {
      icon: XCircle,
      label: "Rejected",
      description: "Your application was not approved",
      color: "text-red-600 bg-red-50 border-red-200",
      badgeColor: "bg-red-100 text-red-800 hover:bg-red-100",
      progress: 0,
    },
    SUSPENDED: {
      icon: AlertCircle,
      label: "Suspended",
      description: "Your account has been temporarily suspended",
      color: "text-orange-600 bg-orange-50 border-orange-200",
      badgeColor: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      progress: 0,
    },
  };

  const statusSteps = [
    {
      step: 1,
      label: "Profile Completed",
      description: "You've completed your profile setup",
      completed: user?.onboardingCompleted,
    },
    {
      step: 2,
      label: "Under Review",
      description: "Our team is reviewing your application",
      completed: user?.onboardingCompleted && status === "PENDING",
    },
    {
      step: 3,
      label: status === "ACCEPTED" ? "Approved" : "Final Decision",
      description:
        status === "ACCEPTED"
          ? "Your application has been approved"
          : "Waiting for final decision",
      completed: status === "ACCEPTED" || status === "REJECTED",
    },
  ];

  const currentConfig = statusConfig[status];
  const StatusIcon = currentConfig.icon;

  const getStatusMessage = () => {
    const baseMessage =
      userRole === "CORPS_MEMBER"
        ? "NYSC Corps Member Application"
        : "SIWES Student Application";

    switch (status) {
      case "PENDING":
        return `${baseMessage} is under review. This usually takes 2-3 business days.`;
      case "ACCEPTED":
        return `Congratulations! Your ${baseMessage.toLowerCase()} has been approved.`;
      case "REJECTED":
        return `Your ${baseMessage.toLowerCase()} was not approved. Please contact support for more information.`;
      case "SUSPENDED":
        return `Your account has been suspended. Please contact support to resolve this issue.`;
      default:
        return baseMessage;
    }
  };

  const getNextSteps = () => {
    switch (status) {
      case "PENDING":
        return [
          "Wait for review completion",
          "Ensure all documents are properly uploaded",
          "Check your email for updates",
        ];
      case "ACCEPTED":
        return [
          "Start applying to job opportunities",
          "Complete your resume if not done",
          "Explore available internships",
        ];
      case "REJECTED":
        return [
          "Contact support for clarification",
          "Review your application details",
          "Consider reapplying with updated information",
        ];
      case "SUSPENDED":
        return [
          "Contact support immediately",
          "Review platform guidelines",
          "Resolve any outstanding issues",
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="w-full max-w-sm border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-green-800">
            Application Status
          </CardTitle>
          <Badge variant="secondary" className={currentConfig.badgeColor}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {currentConfig.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {getStatusMessage()}
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-green-800">
              {currentConfig.progress}%
            </span>
            <span className="text-sm text-gray-500">
              Status: {currentConfig.label}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentConfig.progress}%` }}
            />
          </div>
        </div>

        {/* Status Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">
            Application Progress
          </h4>
          {statusSteps.map((step) => (
            <div
              key={step.step}
              className={`flex items-start space-x-3 p-2 rounded-lg border ${
                step.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  step.completed
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <span className="text-xs font-medium">{step.step}</span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    step.completed ? "text-green-800" : "text-gray-600"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        {getNextSteps().length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900">
              {status === "ACCEPTED" ? "Next Steps" : "What to do next"}
            </h4>
            <ul className="space-y-1">
              {getNextSteps().map((step, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-2 text-xs text-gray-600"
                >
                  <HelpCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Support Information */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <button
              className="text-green-600 hover:text-green-700 font-medium"
              onClick={() => {
                /* Add contact support logic */
              }}
            >
              Contact Support
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
