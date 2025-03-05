
import React from "react";
import { AspectRatioConfig } from "../../../utils/aspectRatioConfig";

interface AspectDisplayProps {
  currentRatioConfig: AspectRatioConfig;
  buttonsRef: HTMLDivElement | null;
}

export const WideAspectDisplay: React.FC<AspectDisplayProps> = ({ currentRatioConfig, buttonsRef }) => {
  return (
    <div 
      className="bg-gray-400 absolute"
      ref={(el) => {
        if (el && buttonsRef) {
          const parentEl = el.parentElement;
          if (parentEl) {
            const buttonsHeight = buttonsRef.offsetHeight;
            const buttonsTop = parseInt(getComputedStyle(buttonsRef).top, 10);
            const parentWidth = parentEl.clientWidth;
            
            // Use 95% of available width for 21:11 aspect ratio
            const maxWidth = parentWidth * 0.95;
            const height = maxWidth * (11/21); // Apply aspect ratio for 21:11
            
            el.style.width = `${maxWidth}px`;
            el.style.height = `${height}px`;
            el.style.left = `${(parentWidth - maxWidth) / 2}px`;
            el.style.top = `${buttonsTop + buttonsHeight}px`;
          }
        }
      }}
    />
  );
};

export const StandardAspectDisplay: React.FC<AspectDisplayProps> = ({ currentRatioConfig, buttonsRef }) => {
  return (
    <div 
      className="bg-gray-400 absolute"
      ref={(el) => {
        if (el && buttonsRef) {
          const parentEl = el.parentElement;
          if (parentEl) {
            const buttonsHeight = buttonsRef.offsetHeight;
            const buttonsTop = parseInt(getComputedStyle(buttonsRef).top, 10);
            const parentWidth = parentEl.clientWidth;
            const maxHeight = parentEl.clientHeight - (buttonsTop + buttonsHeight) - 10; // 10px bottom margin
            
            let width, height;
            
            if (currentRatioConfig.ratio === "1:1") {
              // For square aspect ratio (1:1)
              height = Math.min(maxHeight, parentWidth * 0.8);
              width = height;
            } else if (currentRatioConfig.ratio === "4:5") {
              // For portrait aspect ratio (4:5)
              width = parentWidth * 0.7;
              height = width * (5/4);
              
              // Check if height exceeds available space
              if (height > maxHeight) {
                height = maxHeight;
                width = height * (4/5);
              }
            } else if (currentRatioConfig.ratio === "9:16") {
              // For vertical aspect ratio (9:16)
              width = parentWidth * 0.6;
              height = width * (16/9);
              
              // Check if height exceeds available space
              if (height > maxHeight) {
                height = maxHeight;
                width = height * (9/16);
              }
            } else {
              // Default fallback
              height = maxHeight;
              width = height * (currentRatioConfig.width / currentRatioConfig.height);
            }
            
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.left = `${(parentWidth - width) / 2}px`;
            el.style.top = `${buttonsTop + buttonsHeight}px`;
          }
        }
      }}
    />
  );
};
