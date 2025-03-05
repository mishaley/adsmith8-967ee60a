
import React from "react";
import { Check, X } from "lucide-react";
import { AspectRatioConfig } from "../../../utils/aspectRatioConfig";

interface AspectButtonsProps {
  currentRatioConfig: AspectRatioConfig;
}

export const WideAspectButtons: React.FC<AspectButtonsProps> = ({ currentRatioConfig }) => {
  return (
    <div 
      className="flex absolute"
      style={{ 
        height: '60px',
        top: '20px'
      }}
      ref={(el) => {
        if (el) {
          const parentWidth = el.parentElement?.clientWidth ?? 0;
          // Use 95% of parent width for 10px padding on each side
          const maxWidth = parentWidth * 0.95;
          
          el.style.width = `${maxWidth}px`;
          el.style.left = `${(parentWidth - maxWidth) / 2}px`;
        }
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

export const StandardAspectButtons: React.FC<AspectButtonsProps> = ({ currentRatioConfig }) => {
  return (
    <div 
      className="flex w-full absolute"
      style={{ 
        height: '60px',
        top: '20px',
      }}
      ref={(el) => {
        if (el) {
          const height = el.parentElement?.clientHeight 
            ? el.parentElement.clientHeight - 20 - 60 
            : 0;
          const width = height * (currentRatioConfig.width / currentRatioConfig.height);
          
          el.style.width = `${width}px`;
          el.style.left = `${(el.parentElement?.clientWidth ?? 0) / 2 - width / 2}px`;
        }
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
