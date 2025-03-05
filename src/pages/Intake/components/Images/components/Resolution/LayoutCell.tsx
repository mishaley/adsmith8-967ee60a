
import React, { useRef, useState, useEffect } from "react";
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
  const cellRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(0);

  useEffect(() => {
    if (cellRef.current) {
      setCellWidth(cellRef.current.clientWidth);
      setCellHeight(cellRef.current.clientHeight);
    }
  }, [gridItemStyle]);

  return (
    <div 
      ref={cellRef}
      className="flex items-center justify-center bg-transparent hover:bg-transparent transition-colors relative overflow-hidden" 
      style={gridItemStyle}
    >
      {isTopRow(index) && cellWidth > 0 && cellHeight > 0 && (
        <TopRowCell 
          currentRatioConfig={currentRatioConfig} 
          cellWidth={cellWidth}
          cellHeight={cellHeight}
        />
      )}
    </div>
  );
};

export default LayoutCell;
