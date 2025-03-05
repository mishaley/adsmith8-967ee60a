
import React from "react";
import { AspectRatioConfig } from "../../../utils/aspectRatioConfig";
import { WideAspectButtons, StandardAspectButtons } from "./AspectButtons";
import { WideAspectDisplay, StandardAspectDisplay } from "./AspectDisplay";

interface TopRowCellProps {
  currentRatioConfig: AspectRatioConfig;
  cellWidth: number;
  cellHeight: number;
}

const TopRowCell: React.FC<TopRowCellProps> = ({ 
  currentRatioConfig, 
  cellWidth, 
  cellHeight 
}) => {
  // Fixed height for buttons
  const buttonHeight = 60;
  const isWideAspect = currentRatioConfig.ratio === "21:11";
  
  // Calculate available space remaining for display after buttons
  const availableHeight = cellHeight - buttonHeight - 20; // 20px for spacing
  
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Buttons */}
      {isWideAspect ? (
        <WideAspectButtons 
          currentRatioConfig={currentRatioConfig} 
          containerWidth={cellWidth} 
        />
      ) : (
        <StandardAspectButtons 
          currentRatioConfig={currentRatioConfig} 
          containerWidth={cellWidth} 
        />
      )}
      
      {/* Display */}
      {isWideAspect ? (
        <WideAspectDisplay 
          currentRatioConfig={currentRatioConfig}
          containerWidth={cellWidth}
          containerHeight={cellHeight}
          buttonHeight={buttonHeight}
          availableHeight={availableHeight}
        />
      ) : (
        <StandardAspectDisplay 
          currentRatioConfig={currentRatioConfig}
          containerWidth={cellWidth}
          containerHeight={cellHeight}
          buttonHeight={buttonHeight}
          availableHeight={availableHeight}
        />
      )}
    </div>
  );
};

export { TopRowCell };
