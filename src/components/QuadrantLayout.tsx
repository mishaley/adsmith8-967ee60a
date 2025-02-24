
import { cn } from "@/lib/utils";
import MainNav from "./MainNav";

interface QuadrantLayoutProps {
  children?: {
    q1?: React.ReactNode;
    q2?: React.ReactNode;
    q3?: React.ReactNode;
    q4?: React.ReactNode;
  };
  className?: string;
}

const QuadrantLayout = ({ children, className }: QuadrantLayoutProps) => {
  return (
    <div className={cn("flex h-screen w-full", className)}>
      {/* Left Column - Fixed width */}
      <div className="flex flex-col w-[160px] min-w-[160px]">
        {/* Q1 - Logo */}
        <div className="h-[100px] min-h-[100px] bg-[#0c343d] p-[18px]">
          {children?.q1}
        </div>
        {/* Q2 - Menu */}
        <div className="flex-1 bg-[#154851] text-white text-left">
          <MainNav />
        </div>
      </div>

      {/* Right Column - Flexible width */}
      <div className="flex flex-col flex-1">
        {/* Q3 - Filter */}
        <div className="h-[100px] min-h-[100px] bg-[#2A2A2A] text-white p-[18px]">
          {children?.q3}
        </div>
        {/* Q4 - Canvas */}
        <div className="flex-1 bg-[#d3e4fd] text-[#2A2A2A] pl-[18px] pt-[18px] pb-[18px] overflow-y-auto">
          {children?.q4}
        </div>
      </div>
    </div>
  );
};

export default QuadrantLayout;
