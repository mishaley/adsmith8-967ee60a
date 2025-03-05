
import React from "react";
import { AspectRatioConfig } from "../../utils/aspectRatioConfig";
import { TopRowCell } from "./cells";
import { isTopRow } from "./utils/rowHelpers";

interface LayoutCellProps {
  index: number;
  gridItemStyle: React.CSSProperties;
  currentRatioConfig: AspectRatioConfig;
}

const LayoutCell: React.FC<LayoutCellProps> = ({ 
  index, 
  gridItemStyle, 
  currentRatioConfig 
}) => {
  return (
    <div 
      className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative overflow-hidden" 
      style={gridItemStyle}
    >
      {isTopRow(index) && (
        <TopRowCell currentRatioConfig={currentRatioConfig} />
      )}
    </div>
  );
};

export default LayoutCell;
