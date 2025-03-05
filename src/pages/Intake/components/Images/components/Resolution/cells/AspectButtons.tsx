
import React from "react";
import { Check, X } from "lucide-react";
import { AspectRatioConfig } from "../../../utils/aspectRatioConfig";

interface AspectButtonsProps {
  currentRatioConfig: AspectRatioConfig;
  containerWidth: number;
}

export const WideAspectButtons: React.FC<AspectButtonsProps> = ({ 
  currentRatioConfig, 
  containerWidth 
}) => {
  // Fixed height for buttons
  const buttonHeight = 60;
  // Wide aspect buttons should take up about 95% of the cell width
  const buttonsWidth = containerWidth * 0.95;

  return (
    <div 
      className="flex absolute"
      style={{ 
        width: `${buttonsWidth}px`,
        height: `${buttonHeight}px`,
        top: '0',
        left: `${(containerWidth - buttonsWidth) / 2}px`
      }}
    >
      <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
        <X size={24} color="#990000" />
      </div>
      <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
        <Check size={24} color="#0c343d" />
      </div>
    </div>
  );
};

export const StandardAspectButtons: React.FC<AspectButtonsProps> = ({ 
  currentRatioConfig, 
  containerWidth 
}) => {
  // Fixed height for buttons
  const buttonHeight = 60;
  
  // Determine width based on aspect ratio to match the display width exactly
  let buttonsWidth;
  
  if (currentRatioConfig.ratio === "1:1") {
    // For 1:1, buttons should be square (same as display)
    // Calculate max available height (container width)
    const availableHeight = containerWidth - buttonHeight;
    // For 1:1, display width equals display height
    buttonsWidth = availableHeight;
  } 
  else if (currentRatioConfig.ratio === "4:5") {
    // For 4:5, determine button width based on available height to match display width
    const availableHeight = containerWidth - buttonHeight;
    buttonsWidth = availableHeight * (4/5);
  } 
  else if (currentRatioConfig.ratio === "9:16") {
    // For 9:16, calculate the width to match the display (narrower to accommodate height)
    const availableHeight = containerWidth - buttonHeight;
    const displayHeight = Math.min(availableHeight, containerWidth * 0.9);
    buttonsWidth = displayHeight * (9/16);
  } 
  else {
    // Default fallback
    buttonsWidth = containerWidth * 0.8;
  }
  
  // Make sure buttons width doesn't exceed 95% of container
  buttonsWidth = Math.min(buttonsWidth, containerWidth * 0.95);

  return (
    <div 
      className="flex absolute"
      style={{ 
        width: `${buttonsWidth}px`,
        height: `${buttonHeight}px`,
        top: '0',
        left: `${(containerWidth - buttonsWidth) / 2}px`
      }}
    >
      <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
        <X size={24} color="#990000" />
      </div>
      <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
        <Check size={24} color="#0c343d" />
      </div>
    </div>
  );
};
