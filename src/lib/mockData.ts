import type { ProfileTask } from "@/types/progressCardTypes";
import type { Activity } from "@/types/recentActivitiesType";

export const generateMockActivities = (count: number): Activity[] => {
  const activities: Activity[] = [];
  const now = new Date();

  const subtitles = [
    "Your profile information has been updated successfully",
    "New message received from the support team",
    "Document approval required for next steps",
    "Payment processed successfully for invoice #INV-2024",
    "Security settings updated on your account",
    "New login detected from unfamiliar device",
    "Application status changed to under review",
    "Reminder: Complete your profile setup",
    "Weekly summary report is now available",
    "System maintenance scheduled for tonight",
  ];

  const titles = [
    "Profile Updated",
    "New Message",
    "Action Required",
    "Payment Processed",
    "Security Update",
    "Security Alert",
    "Status Update",
    "Reminder",
    "Report Ready",
    "Maintenance Notice",
  ];

  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.floor(Math.random() * 5); // Up to 5 hours ago
    const minutesAgo = Math.floor(Math.random() * 60);
    const totalMinutesAgo = hoursAgo * 60 + minutesAgo;

    const createdAt = new Date(now.getTime() - totalMinutesAgo * 60 * 1000);

    // Updated at is either the same as created or slightly later
    const updatedAt =
      Math.random() > 0.7
        ? new Date(
            createdAt.getTime() + Math.floor(Math.random() * 30) * 60 * 1000
          )
        : createdAt;

    activities.push({
      id: `activity-${i + 1}`,
      title:
        Math.random() > 0.2
          ? titles[Math.floor(Math.random() * titles.length)]
          : undefined,
      subtitle: subtitles[Math.floor(Math.random() * subtitles.length)],
      createdAt,
      updatedAt,
    });
  }

  return activities.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
};

export const defaultTasks: ProfileTask[] = [
  {
    id: "address",
    label: "Add your address",
    completed: false,
    required: true,
  },
  {
    id: "email",
    label: "Confirm your email",
    completed: true,
    required: true,
  },
  {
    id: "resume",
    label: "Upload your resume",
    completed: false,
    required: true,
  },
  {
    id: "phone",
    label: "Add your phone number",
    completed: true,
    required: false,
  },
];

export const calculateCompletionPercentage = (tasks: ProfileTask[]): number => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  return Math.round((completedTasks / totalTasks) * 100);
};
