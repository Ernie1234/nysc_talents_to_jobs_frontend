import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  condition?: boolean;
};

const Wrapper = ({ children, className = "", condition = true }: Props) => {
  if (!condition) return null;

  return (
    <div className={cn("p-3 rounded-md shadow bg-white", className)}>
      {children}
    </div>
  );
};

export default Wrapper;
