
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
        top: '10px',
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
  
  // Determine width based on aspect ratio
  let buttonsWidth;
  if (currentRatioConfig.ratio === "1:1") {
    buttonsWidth = containerWidth * 0.8; // Square ratio
  } else if (currentRatioConfig.ratio === "4:5") {
    buttonsWidth = containerWidth * 0.7; // Portrait ratio
  } else if (currentRatioConfig.ratio === "9:16") {
    buttonsWidth = containerWidth * 0.6; // Vertical ratio
  } else {
    buttonsWidth = containerWidth * 0.8; // Default fallback
  }

  return (
    <div 
      className="flex absolute"
      style={{ 
        width: `${buttonsWidth}px`,
        height: `${buttonHeight}px`,
        top: '10px',
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
