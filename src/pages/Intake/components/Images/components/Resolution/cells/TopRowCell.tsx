import React, { useRef, useEffect } from "react";
import { AspectRatioConfig } from "../../../utils/aspectRatioConfig";
import { WideAspectButtons, StandardAspectButtons } from "./AspectButtons";
import { WideAspectDisplay, StandardAspectDisplay } from "./AspectDisplay";

interface TopRowCellProps {
  currentRatioConfig: AspectRatioConfig;
}

const TopRowCell: React.FC<TopRowCellProps> = ({ currentRatioConfig }) => {
  const cellRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const displayRef = useRef<HTMLDivElement | null>(null);
  
  const isWideAspect = currentRatioConfig.ratio === "21:11";
  
  useEffect(() => {
    if (cellRef.current && buttonsRef.current && displayRef.current) {
      adjustSizing();
    }
  }, [currentRatioConfig.ratio]);
  
  const adjustSizing = () => {
    if (!cellRef.current || !buttonsRef.current || !displayRef.current) return;
    
    const cellHeight = cellRef.current.clientHeight;
    const buttonsHeight = 60;
    
    let buttonsWidth;
    if (isWideAspect) {
      buttonsWidth = cellRef.current.clientWidth * 0.95;
    } else if (currentRatioConfig.ratio === "1:1") {
      buttonsWidth = cellRef.current.clientWidth * 0.8;
    } else if (currentRatioConfig.ratio === "4:5") {
      buttonsWidth = cellRef.current.clientWidth * 0.7;
    } else if (currentRatioConfig.ratio === "9:16") {
      buttonsWidth = cellRef.current.clientWidth * 0.6;
    } else {
      buttonsWidth = cellRef.current.clientWidth * 0.8;
    }
    
    let displayHeight;
    if (isWideAspect) {
      displayHeight = buttonsWidth * (11/21);
    } else if (currentRatioConfig.ratio === "1:1") {
      displayHeight = buttonsWidth;
    } else if (currentRatioConfig.ratio === "4:5") {
      displayHeight = buttonsWidth * (5/4);
    } else if (currentRatioConfig.ratio === "9:16") {
      displayHeight = buttonsWidth * (16/9);
    } else {
      displayHeight = buttonsWidth;
    }
    
    const totalHeight = buttonsHeight + displayHeight;
    if (totalHeight > cellHeight - 30) {
      const scaleFactor = (cellHeight - 30) / totalHeight;
      displayHeight = displayHeight * scaleFactor;
    }
    
    const buttonContainer = buttonsRef.current.querySelector('.flex.absolute') as HTMLElement;
    if (buttonContainer) {
      buttonContainer.style.width = `${buttonsWidth}px`;
      buttonContainer.style.left = `${(cellRef.current.clientWidth - buttonsWidth) / 2}px`;
    }
    
    displayRef.current.style.width = `${buttonsWidth}px`;
    displayRef.current.style.height = `${displayHeight}px`;
    displayRef.current.style.left = buttonContainer?.style.left || `${(cellRef.current.clientWidth - buttonsWidth) / 2}px`;
    displayRef.current.style.top = `${buttonsHeight + 20}px`;
  };

  return (
    <div 
      ref={cellRef}
      className="w-full h-full flex flex-col justify-center items-center relative"
      style={{ paddingTop: '20px' }}
    >
      <div ref={buttonsRef} className="w-full">
        {isWideAspect ? (
          <WideAspectButtons currentRatioConfig={currentRatioConfig} />
        ) : (
          <StandardAspectButtons currentRatioConfig={currentRatioConfig} />
        )}
      </div>
      
      <div ref={displayRef} className="bg-gray-400 absolute">
        {/* Display content goes here */}
      </div>
    </div>
  );
};

export { TopRowCell };
