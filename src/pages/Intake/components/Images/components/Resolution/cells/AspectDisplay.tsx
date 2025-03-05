
import React from "react";
import { AspectRatioConfig } from "../../../utils/aspectRatioConfig";

interface AspectDisplayProps {
  currentRatioConfig: AspectRatioConfig;
  containerWidth: number;
  containerHeight: number;
  buttonHeight: number;
  buttonsWidth: number;
}

export const WideAspectDisplay: React.FC<AspectDisplayProps> = ({
  currentRatioConfig,
  containerWidth,
  containerHeight,
  buttonHeight,
  buttonsWidth
}) => {
  // Calculate the display width (same as buttons width)
  const displayWidth = buttonsWidth;
  
  // Calculate height based on aspect ratio (21:11)
  const displayHeight = displayWidth * (11/21);
  
  // Calculate total component height (buttons + display)
  const totalHeight = buttonHeight + displayHeight + 40; // 40px for spacing
  
  // Scale if too large for container
  const scale = totalHeight > containerHeight - 30 ? (containerHeight - 30) / totalHeight : 1;
  const scaledDisplayHeight = displayHeight * scale;
  
  return (
    <div 
      className="bg-gray-400 absolute"
      style={{
        width: `${displayWidth}px`,
        height: `${scaledDisplayHeight}px`,
        left: `${(containerWidth - displayWidth) / 2}px`,
        top: `${buttonHeight + 20}px`,
      }}
    />
  );
};

export const StandardAspectDisplay: React.FC<AspectDisplayProps> = ({
  currentRatioConfig,
  containerWidth,
  containerHeight,
  buttonHeight,
  buttonsWidth
}) => {
  // Calculate display width (same as buttons width)
  const displayWidth = buttonsWidth;
  
  // Calculate height based on aspect ratio
  let displayHeight;
  if (currentRatioConfig.ratio === "1:1") {
    displayHeight = displayWidth; // 1:1 ratio
  } else if (currentRatioConfig.ratio === "4:5") {
    displayHeight = displayWidth * (5/4); // 4:5 ratio
  } else if (currentRatioConfig.ratio === "9:16") {
    displayHeight = displayWidth * (16/9); // 9:16 ratio
  } else {
    displayHeight = displayWidth; // Default fallback
  }
  
  // Calculate total component height (buttons + display)
  const totalHeight = buttonHeight + displayHeight + 40; // 40px for spacing
  
  // Scale if too large for container
  const scale = totalHeight > containerHeight - 30 ? (containerHeight - 30) / totalHeight : 1;
  const scaledDisplayHeight = displayHeight * scale;
  
  return (
    <div 
      className="bg-gray-400 absolute"
      style={{
        width: `${displayWidth}px`,
        height: `${scaledDisplayHeight}px`,
        left: `${(containerWidth - displayWidth) / 2}px`,
        top: `${buttonHeight + 20}px`,
      }}
    />
  );
};
