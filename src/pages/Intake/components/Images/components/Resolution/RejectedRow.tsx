
import React from "react";
import { AspectRatioConfig } from "../../utils/aspectRatioConfig";
import { X } from "lucide-react";

interface RejectedRowProps {
  cellHeight: number;
  containerWidth: number;
  currentRatioConfig: AspectRatioConfig;
}

const RejectedRow: React.FC<RejectedRowProps> = ({ 
  cellHeight, 
  containerWidth,
  currentRatioConfig
}) => {
  // Reduce the height to 25% of the original
  const rowHeight = cellHeight * 0.25;
  
  return (
    <div className="grid grid-cols-3 w-full">
      <div 
        className="col-span-3 bg-red-50 border border-red-200 flex items-center pl-4" 
        style={{ height: `${rowHeight}px` }}
      >
        <X size={20} color="#990000" />
      </div>
    </div>
  );
};

export default RejectedRow;
