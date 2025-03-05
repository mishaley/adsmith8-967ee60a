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
  containerHeight,
  buttonHeight,
  availableHeight
}) => {
  const aspectRatio = 21 / 11;
  
  // Calculate the maximum possible display height based on available height
  const maxDisplayHeight = availableHeight;
  
  // Calculate the display width based on the maximum height and aspect ratio
  let displayWidth = maxDisplayHeight * aspectRatio;
  
  // If the calculated width exceeds the container width, adjust the height
  if (displayWidth > containerWidth) {
    displayWidth = containerWidth * 0.95;
  }

  const displayHeight = displayWidth / aspectRatio;
  
  return (
    <div 
      className="bg-transparent absolute"
      style={{ 
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        left: `${(containerWidth - displayWidth) / 2}px`,
        top: `${buttonHeight}px`
      }}
    />
  );
};

export const StandardAspectDisplay: React.FC<AspectDisplayProps> = ({
  currentRatioConfig,
  containerWidth,
  containerHeight,
  buttonHeight,
  availableHeight
}) => {
  let aspectRatio;
  
  if (currentRatioConfig.ratio === "1:1") {
    aspectRatio = 1;
  } else if (currentRatioConfig.ratio === "4:5") {
    aspectRatio = 4 / 5;
  } else if (currentRatioConfig.ratio === "9:16") {
    aspectRatio = 9 / 16;
  } else {
    aspectRatio = 1; // Default to 1:1 if ratio is not recognized
  }
  
  // Calculate the maximum possible display height based on available height
  const maxDisplayHeight = availableHeight;
  
  // Calculate the display width based on the maximum height and aspect ratio
  let displayWidth = maxDisplayHeight * aspectRatio;
  
  // If the calculated width exceeds the container width, adjust the height
  if (displayWidth > containerWidth) {
    displayWidth = containerWidth * 0.95;
  }

  const displayHeight = displayWidth / aspectRatio;
  
  return (
    <div 
      className="bg-transparent absolute"
      style={{ 
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        left: `${(containerWidth - displayWidth) / 2}px`,
        top: `${buttonHeight}px`
      }}
    />
  );
};
