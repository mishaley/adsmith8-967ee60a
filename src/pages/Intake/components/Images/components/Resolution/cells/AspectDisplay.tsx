
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
            const buttonsTop = parseInt(buttonsRef.style.top, 10);
            const parentWidth = parentEl.clientWidth;
            
            // Use 95% of available width for 10px padding on each side
            const maxWidth = parentWidth * 0.95;
            const height = maxWidth * (11/21); // Apply aspect ratio for 21:11
            
            el.style.width = `${maxWidth}px`;
            el.style.height = `${height}px`;
            el.style.left = `${(parentWidth - maxWidth) / 2}px`;
            // Remove gap by setting top position to button bottom
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
      style={{ 
        top: 'auto',
        height: 'auto',
        width: 'auto',
        bottom: 0,
      }}
      ref={(el) => {
        if (el && buttonsRef) {
          const parentEl = el.parentElement;
          if (parentEl) {
            const buttonsHeight = buttonsRef.offsetHeight;
            const buttonsTop = parseInt(buttonsRef.style.top, 10);
            const totalHeight = parentEl.clientHeight;
            const height = totalHeight - (buttonsTop + buttonsHeight);
            const width = height * (currentRatioConfig.width / currentRatioConfig.height);
            
            el.style.height = `${height}px`;
            el.style.width = `${width}px`;
            el.style.left = `${(parentEl.offsetWidth - width) / 2}px`;
            el.style.top = `${buttonsTop + buttonsHeight}px`;
          }
        }
      }}
    />
  );
};
