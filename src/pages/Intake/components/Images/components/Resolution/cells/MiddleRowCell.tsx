
import React, { useRef } from "react";
import { Check, X } from "lucide-react";

const MiddleRowCell: React.FC = () => {
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  
  return (
    <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-purple-100 text-purple-800 text-xs font-medium p-1 rounded">
        4:5
      </div>
      
      <div ref={buttonsRef} className="w-full">
        <div 
          className="flex absolute"
          style={{ 
            height: '60px',
            top: '20px',
          }}
          ref={(el) => {
            if (el) {
              const parentEl = el.parentElement?.parentElement;
              if (parentEl) {
                const maxWidth = parentEl.clientWidth * 0.7; // 70% of parent width
                
                el.style.width = `${maxWidth}px`;
                el.style.left = `${(parentEl.clientWidth - maxWidth) / 2}px`;
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
      </div>
      
      <div 
        className="bg-gray-400 absolute"
        ref={(el) => {
          if (el && buttonsRef.current) {
            const parentEl = el.parentElement;
            if (parentEl) {
              const buttonContainer = buttonsRef.current.querySelector('.flex.absolute') as HTMLElement;
              if (buttonContainer) {
                const buttonsHeight = buttonContainer.offsetHeight;
                const buttonsTop = parseInt(getComputedStyle(buttonContainer).top, 10);
                const parentWidth = parentEl.clientWidth;
                const parentHeight = parentEl.clientHeight;
                
                const width = parentWidth * 0.7;
                const height = width * (5/4);
                
                // Calculate maximum available height
                const maxHeight = parentHeight - (buttonsTop + buttonsHeight) - 10;
                
                // Adjust if height exceeds available space
                const finalHeight = Math.min(height, maxHeight);
                const finalWidth = finalHeight * (4/5);
                
                el.style.height = `${finalHeight}px`;
                el.style.width = `${finalWidth}px`;
                el.style.left = `${(parentWidth - finalWidth) / 2}px`;
                el.style.top = `${buttonsTop + buttonsHeight}px`;
              }
            }
          }
        }}
      />
    </div>
  );
};

export { MiddleRowCell };
