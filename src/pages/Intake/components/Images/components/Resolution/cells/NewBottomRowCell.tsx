
import React, { useRef } from "react";
import { Check, X } from "lucide-react";

const NewBottomRowCell: React.FC = () => {
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  
  return (
    <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-xs font-medium p-1 rounded">
        21:11
      </div>
      
      <div 
        ref={el => {
          buttonsRef.current = el;
          // Force reflow to ensure the ref is updated
          if (el) el.getBoundingClientRect();
        }}
        className="w-full"
      >
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
                const maxWidth = parentEl.clientWidth * 0.95; // 95% of parent width
                
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
              const buttons = buttonsRef.current.querySelector('.flex.absolute') as HTMLElement;
              if (buttons) {
                const buttonsHeight = buttons.offsetHeight;
                const buttonsTop = parseInt(getComputedStyle(buttons).top, 10);
                const parentWidth = parentEl.clientWidth;
                
                // Use 95% of available width for 10px padding on each side
                const maxWidth = parentWidth * 0.95;
                const height = maxWidth * (11/21); // Apply aspect ratio
                
                el.style.width = `${maxWidth}px`;
                el.style.height = `${height}px`;
                el.style.left = `${(parentWidth - maxWidth) / 2}px`;
                el.style.top = `${buttonsTop + buttonsHeight}px`;
              }
            }
          }
        }}
      />
    </div>
  );
};

export { NewBottomRowCell };
