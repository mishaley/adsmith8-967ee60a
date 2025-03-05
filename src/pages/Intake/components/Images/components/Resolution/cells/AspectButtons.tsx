
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
      className="flex absolute"
      style={{ 
        height: '60px',
        top: '20px'
      }}
      ref={(el) => {
        if (el) {
          const parentEl = el.parentElement;
          if (parentEl) {
            // Calculate dimensions based on aspect ratio
            const maxWidth = parentEl.clientWidth * 0.9; // 90% of parent width
            let width;
            
            // Determine width based on aspect ratio
            if (currentRatioConfig.ratio === "1:1") {
              width = maxWidth * 0.8; // Square ratio
            } else if (currentRatioConfig.ratio === "4:5") {
              width = maxWidth * 0.7; // Portrait
            } else if (currentRatioConfig.ratio === "9:16") {
              width = maxWidth * 0.6; // Vertical
            } else {
              // Default fallback
              width = maxWidth * 0.8;
            }
            
            el.style.width = `${width}px`;
            el.style.left = `${(parentEl.clientWidth - width) / 2}px`;
          }
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
