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
            const buttonContainer = buttonsRef.querySelector('.flex.absolute') as HTMLElement;
            if (buttonContainer) {
              // Make sure to use the exact same width as the buttons
              const buttonsWidth = parseFloat(buttonContainer.style.width);
              const buttonsHeight = buttonContainer.offsetHeight;
              const buttonsTop = parseInt(getComputedStyle(buttonContainer).top, 10);
              
              const height = buttonsWidth * (11/21); // Apply aspect ratio for 21:11
              
              el.style.width = `${buttonsWidth}px`;
              el.style.height = `${height}px`;
              el.style.left = buttonContainer.style.left;
              el.style.top = `${buttonsTop + buttonsHeight}px`;
            }
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
            const buttonContainer = buttonsRef.querySelector('.flex.absolute') as HTMLElement;
            if (buttonContainer) {
              const buttonsWidth = parseFloat(buttonContainer.style.width);
              const buttonsHeight = buttonContainer.offsetHeight;
              const buttonsTop = parseInt(getComputedStyle(buttonContainer).top, 10);
              
              let width, height;
              
              if (currentRatioConfig.ratio === "1:1") {
                // For square aspect ratio (1:1)
                width = buttonsWidth;
                height = width;
              } else if (currentRatioConfig.ratio === "4:5") {
                // For portrait aspect ratio (4:5)
                width = buttonsWidth;
                height = width * (5/4);
              } else if (currentRatioConfig.ratio === "9:16") {
                // For vertical aspect ratio (9:16)
                width = buttonsWidth;
                height = width * (16/9);
              } else {
                // Default fallback
                width = buttonsWidth;
                height = width;
              }
              
              el.style.width = `${width}px`;
              el.style.height = `${height}px`;
              el.style.left = buttonContainer.style.left;
              el.style.top = `${buttonsTop + buttonsHeight}px`;
            }
          }
        }
      }}
    />
  );
};
