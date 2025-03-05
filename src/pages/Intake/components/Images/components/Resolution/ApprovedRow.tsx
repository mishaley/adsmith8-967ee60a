
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
  // Reduce the height to 25% of the original
  const rowHeight = cellHeight * 0.25;
  
  return (
    <div className="grid grid-cols-3 w-full">
      <div 
        className="col-span-3 bg-green-50 border border-green-200" 
        style={{ height: `${rowHeight}px` }}
      />
    </div>
  );
};

export default ApprovedRow;
