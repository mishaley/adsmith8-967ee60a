
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  className = "bg-[#e9f2fe] p-4 mb-6 rounded-lg"
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={className}>
      <div
        className="flex justify-between items-center cursor-pointer py-2"
        onClick={toggleCollapse}
      >
        <h2 className="text-center w-full text-gray-700 font-bold text-xl">
          {title}
        </h2>
        <div className="flex-shrink-0">
          {isCollapsed ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-h-0 opacity-0 mt-0' : 'max-h-[5000px] opacity-100 mt-2'}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection;
