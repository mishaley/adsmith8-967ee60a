
import React from "react";
import { AspectRatioConfig } from "../../utils/aspectRatioConfig";
import { Check } from "lucide-react";

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
  const columnWidth = containerWidth / 3;
  
  const gridItemStyle = {
    height: `${cellHeight}px`,
    width: `${columnWidth}px`,
    border: '1px solid #e0e0e0',
  };

  return (
    <div className="grid grid-cols-3 w-full">
      <div 
        className="col-span-3 flex items-center justify-center bg-green-50 border border-green-200" 
        style={{ height: `${cellHeight}px` }}
      >
        <div className="flex items-center space-x-2">
          <Check size={24} className="text-green-600" />
          <span className="text-lg font-medium text-green-800">Approved {currentRatioConfig.label} Images</span>
        </div>
      </div>
    </div>
  );
};

export default ApprovedRow;
