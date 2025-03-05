
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
  const columnWidth = containerWidth / 3;
  
  const gridItemStyle = {
    height: `${cellHeight}px`,
    width: `${columnWidth}px`,
    border: '1px solid #e0e0e0',
  };

  return (
    <div className="grid grid-cols-3 w-full">
      <div 
        className="col-span-3 flex items-center justify-center bg-red-50 border border-red-200" 
        style={{ height: `${cellHeight}px` }}
      >
        <div className="flex items-center space-x-2">
          <X size={24} className="text-red-600" />
          <span className="text-lg font-medium text-red-800">Rejected {currentRatioConfig.label} Images</span>
        </div>
      </div>
    </div>
  );
};

export default RejectedRow;
