
import React, { useRef, useEffect, useState } from "react";
import { AspectRatioConfig } from "../../../utils/aspectRatioConfig";
import { WideAspectButtons, StandardAspectButtons } from "./AspectButtons";
import { WideAspectDisplay, StandardAspectDisplay } from "./AspectDisplay";

interface TopRowCellProps {
  currentRatioConfig: AspectRatioConfig;
}

const TopRowCell: React.FC<TopRowCellProps> = ({ currentRatioConfig }) => {
  const cellRef = useRef<HTMLDivElement | null>(null);
  const [cellWidth, setCellWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(0);
  
  const isWideAspect = currentRatioConfig.ratio === "21:11";
  const buttonHeight = 60; // Fixed height for buttons
  
  // Calculate button width based on aspect ratio
  let buttonsWidth;
  if (isWideAspect) {
    buttonsWidth = cellWidth * 0.95; // Wide aspect
  } else if (currentRatioConfig.ratio === "1:1") {
    buttonsWidth = cellWidth * 0.8; // Square
  } else if (currentRatioConfig.ratio === "4:5") {
    buttonsWidth = cellWidth * 0.7; // Portrait
  } else if (currentRatioConfig.ratio === "9:16") {
    buttonsWidth = cellWidth * 0.6; // Vertical
  } else {
    buttonsWidth = cellWidth * 0.8; // Default
  }
  
  useEffect(() => {
    const updateSize = () => {
      if (cellRef.current) {
        setCellWidth(cellRef.current.clientWidth);
        setCellHeight(cellRef.current.clientHeight);
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return (
    <div 
      ref={cellRef}
      className="w-full h-full flex flex-col justify-center items-center relative"
    >
      {cellWidth > 0 && cellHeight > 0 && (
        <>
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
              buttonsWidth={buttonsWidth}
            />
          ) : (
            <StandardAspectDisplay 
              currentRatioConfig={currentRatioConfig}
              containerWidth={cellWidth}
              containerHeight={cellHeight}
              buttonHeight={buttonHeight}
              buttonsWidth={buttonsWidth}
            />
          )}
        </>
      )}
    </div>
  );
};

export { TopRowCell };
