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
  const buttonHeight = 60;
  const buttonsWidth = containerWidth * 0.95;

  return (
    <div 
      className="flex absolute bg-transparent"
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
  const buttonHeight = 60;

  let buttonsWidth;
  
  if (currentRatioConfig.ratio === "1:1") {
    const availableHeight = containerWidth - buttonHeight;
    buttonsWidth = availableHeight;
  } 
  else if (currentRatioConfig.ratio === "4:5") {
    const availableHeight = containerWidth - buttonHeight;
    buttonsWidth = availableHeight * (4/5);
  } 
  else if (currentRatioConfig.ratio === "9:16") {
    const availableHeight = containerWidth - buttonHeight;
    const displayHeight = Math.min(availableHeight, containerWidth * 0.9);
    buttonsWidth = displayHeight * (9/16);
  } 
  else {
    buttonsWidth = containerWidth * 0.8;
  }
  
  buttonsWidth = Math.min(buttonsWidth, containerWidth * 0.95);

  return (
    <div 
      className="flex absolute bg-transparent"
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
