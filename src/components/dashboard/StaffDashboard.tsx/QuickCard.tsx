import { type LucideIcon } from "lucide-react";

interface QuickCardProps {
  title: string;
  number: string | number;
  icon: LucideIcon;
  color?: string;
}

const QuickCard = ({
  title,
  number,
  icon: Icon,
  color = "bg-green-800",
}: QuickCardProps) => {
  return (
    <div className="flex w-full justify-between items-center gap-4 p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1">
        <span className="text-gray-900 font-bold text-2xl">{number}</span>
        <span className="text-gray-600 text-sm font-medium">{title}</span>
      </div>
      <div
        className={`flex p-3 justify-center items-center ${color} rounded-full text-white h-fit`}
      >
        <Icon size={20} />
      </div>
    </div>
  );
};

export default QuickCard;
