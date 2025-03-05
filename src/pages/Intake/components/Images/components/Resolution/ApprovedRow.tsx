
import React from "react";
import { AspectRatioConfig } from "../../utils/aspectRatioConfig";
import { Check } from "lucide-react";
import { cn } from "../../../../../../lib/utils";

interface ApprovedRowProps {
  cellHeight: number;
  containerWidth: number;
  currentRatioConfig: AspectRatioConfig;
}

const ApprovedRow: React.FC<ApprovedRowProps> = ({ 
  cellHeight, 
  containerWidth,
  currentRatioConfig
}) => {
  // Reduce the height to 25% of the original
  const rowHeight = cellHeight * 0.25;
  
  return (
    <div className="grid grid-cols-3 w-full">
      <div 
        className="col-span-3 bg-white border border-green-200 flex items-center pl-4 py-[10px]" 
        style={{ height: `${rowHeight}px` }}
      >
        <Check size={20} color="#0c343d" />
        <div className="flex ml-4 gap-1 h-full items-center flex-1 pr-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div 
              key={index}
              className={cn(
                "bg-gray-200 rounded-sm flex-shrink-0",
                "aspect-square h-[80%]"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApprovedRow;
