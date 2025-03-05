
import React from "react";
import { AspectRatioConfig } from "../../../utils/aspectRatioConfig";

interface AspectDisplayProps {
  currentRatioConfig: AspectRatioConfig;
  containerWidth: number;
  containerHeight: number;
  buttonHeight: number;
  availableHeight: number;
}

export const WideAspectDisplay: React.FC<AspectDisplayProps> = ({
  currentRatioConfig,
  containerWidth,
  buttonHeight,
  availableHeight
}) => {
  // Calculate display width (same as buttons width for wide aspect)
  const displayWidth = containerWidth * 0.95;
  
  // Calculate height based on aspect ratio (21:11)
  const aspectHeight = displayWidth * (11/21);
  
  // Make sure the display doesn't exceed the available height
  const displayHeight = Math.min(aspectHeight, availableHeight);
  
  return (
    <div 
      className="bg-gray-400 absolute"
      style={{
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        left: `${(containerWidth - displayWidth) / 2}px`,
        top: `${buttonHeight + 20}px`,
      }}
    />
  );
};

export const StandardAspectDisplay: React.FC<AspectDisplayProps> = ({
  currentRatioConfig,
  containerWidth,
  buttonHeight,
  availableHeight
}) => {
  // Calculate display width based on aspect ratio
  let displayWidth;
  if (currentRatioConfig.ratio === "1:1") {
    displayWidth = containerWidth * 0.8; // Square ratio
  } else if (currentRatioConfig.ratio === "4:5") {
    displayWidth = containerWidth * 0.7; // Portrait ratio
  } else if (currentRatioConfig.ratio === "9:16") {
    displayWidth = containerWidth * 0.6; // Vertical ratio
  } else {
    displayWidth = containerWidth * 0.8; // Default fallback
  }
  
  // Calculate height based on aspect ratio
  let aspectHeight;
  if (currentRatioConfig.ratio === "1:1") {
    aspectHeight = displayWidth; // 1:1 ratio
  } else if (currentRatioConfig.ratio === "4:5") {
    aspectHeight = displayWidth * (5/4); // 4:5 ratio
  } else if (currentRatioConfig.ratio === "9:16") {
    aspectHeight = displayWidth * (16/9); // 9:16 ratio
  } else {
    aspectHeight = displayWidth; // Default fallback
  }
  
  // Make sure the display doesn't exceed the available height
  const displayHeight = Math.min(aspectHeight, availableHeight);
  
  return (
    <div 
      className="bg-gray-400 absolute"
      style={{
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        left: `${(containerWidth - displayWidth) / 2}px`,
        top: `${buttonHeight + 20}px`,
      }}
    />
  );
};
