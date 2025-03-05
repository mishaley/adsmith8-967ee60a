
import React from "react";
import { AspectRatioConfig } from "../../utils/aspectRatioConfig";
import { 
  TopRowCell, 
  MiddleRowCell, 
  BottomRowCell, 
  NewBottomRowCell 
} from "./cells";
import { 
  isTopRow, 
  isMiddleRow, 
  isBottomRow, 
  isNewBottomRow 
} from "./utils/rowHelpers";

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
      className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative" 
      style={gridItemStyle}
    >
      {isTopRow(index) && (
        <TopRowCell currentRatioConfig={currentRatioConfig} />
      )}

      {isMiddleRow(index) && (
        <MiddleRowCell />
      )}

      {isBottomRow(index) && (
        <BottomRowCell />
      )}

      {isNewBottomRow(index) && (
        <NewBottomRowCell />
      )}
    </div>
  );
};

export default LayoutCell;
