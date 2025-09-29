import { type LucideIcon } from "lucide-react";

import Wrapper from "../Wrapper";

interface QuickCardProps {
  title: string;
  number: string | number;
  icon: LucideIcon;
}

const QuickCard = ({ title, number, icon: Icon }: QuickCardProps) => {
  return (
    <Wrapper className="flex w-full justify-between items-center gap-14 p-5 rounded-2xl mr-4">
      <div className="flex flex-col gap-2">
        <span className="text-green-800 font-semibold text-4xl">{number}</span>
        <span className="text-gray-500 text-base">{title}</span>
      </div>
      <div className="flex p-3 justify-center items-center bg-green-800 rounded-full text-white h-fit">
        <Icon size={24} />
      </div>
    </Wrapper>
  );
};

export default QuickCard;
