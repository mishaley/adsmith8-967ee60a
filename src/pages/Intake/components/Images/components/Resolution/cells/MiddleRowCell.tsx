
import React, { useRef } from "react";
import { Check, X } from "lucide-react";

const MiddleRowCell: React.FC = () => {
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  
  return (
    <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-purple-100 text-purple-800 text-xs font-medium p-1 rounded">
        4:5
      </div>
      
      <div 
        ref={el => {
          buttonsRef.current = el;
          // Force reflow to ensure the ref is updated
          if (el) el.getBoundingClientRect();
        }}
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
              const buttons = buttonsRef.current.querySelector('.flex.absolute') as HTMLElement;
              if (buttons) {
                const buttonsHeight = buttons.offsetHeight;
                const buttonsTop = parseInt(buttons.style.top, 10);
                const totalHeight = parentEl.clientHeight;
                // Calculate dimensions
                const height = totalHeight - (buttonsTop + buttonsHeight) - 10; // 10px bottom margin
                const width = height * (4/5);
                
                el.style.height = `${height}px`;
                el.style.width = `${width}px`;
                el.style.left = `${(parentEl.clientWidth - width) / 2}px`;
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
