
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
        top: `${buttonHeight}px`,
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
  let displayWidth;
  let displayHeight;
  
  if (currentRatioConfig.ratio === "1:1") {
    // For 1:1 (square), maximize height to fill the space
    displayHeight = availableHeight;
    displayWidth = displayHeight; // Because it's a 1:1 square
    
    // Make sure width doesn't exceed container width
    if (displayWidth > containerWidth * 0.95) {
      displayWidth = containerWidth * 0.95;
      displayHeight = displayWidth; // Maintain 1:1 ratio
    }
  } 
  else if (currentRatioConfig.ratio === "4:5") {
    // For 4:5, maximize height to fill the space
    displayHeight = availableHeight;
    displayWidth = displayHeight * (4/5); // Calculate width based on 4:5 ratio
    
    // Make sure width doesn't exceed container width
    if (displayWidth > containerWidth * 0.95) {
      displayWidth = containerWidth * 0.95;
      displayHeight = displayWidth * (5/4); // Maintain 4:5 ratio
    }
  } 
  else if (currentRatioConfig.ratio === "9:16") {
    // For 9:16, much taller than wide
    // Calculate maximum height available
    displayHeight = availableHeight;
    displayWidth = displayHeight * (9/16); // Calculate width based on 9:16 ratio
    
    // Make sure width doesn't exceed container width
    if (displayWidth > containerWidth * 0.95) {
      displayWidth = containerWidth * 0.95;
      displayHeight = displayWidth * (16/9); // Maintain 9:16 ratio
    }
  } 
  else {
    // Default fallback
    displayWidth = containerWidth * 0.8;
    displayHeight = displayWidth;
    
    if (displayHeight > availableHeight) {
      displayHeight = availableHeight;
      displayWidth = displayHeight;
    }
  }
  
  return (
    <div 
      className="bg-gray-400 absolute"
      style={{
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        left: `${(containerWidth - displayWidth) / 2}px`,
        top: `${buttonHeight}px`,
      }}
    />
  );
};
