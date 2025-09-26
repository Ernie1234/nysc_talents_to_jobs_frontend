export interface ProfileTask {
  id: string;
  label: string;
  completed: boolean;
  required?: boolean;
}

export interface ProfileCompletionProps {
  completionPercentage: number;
  tasks: ProfileTask[];
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  onViewAll?: () => void;
}
