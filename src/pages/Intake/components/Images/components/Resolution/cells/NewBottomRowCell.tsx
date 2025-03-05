
import React from "react";
import { Check, X } from "lucide-react";

const NewBottomRowCell: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-xs font-medium p-1 rounded">
        21:11
      </div>
      
      <div 
        className="flex w-full absolute"
        style={{ 
          height: '60px',
          top: '20px',
        }}
        ref={(el) => {
          if (el) {
            const parentWidth = el.parentElement?.clientWidth ?? 0;
            // Use 95% of parent width to have 10px padding on each side
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
      
      <div 
        className="bg-gray-400 absolute"
        style={{ 
          top: 'auto',
          height: 'auto',
          width: 'auto',
        }}
        ref={(el) => {
          if (el) {
            const parentEl = el.parentElement;
            if (parentEl) {
              const buttons = parentEl.querySelector('.flex.w-full.absolute') as HTMLElement;
              if (buttons) {
                const buttonsHeight = buttons.offsetHeight;
                const buttonsTop = parseInt(buttons.style.top, 10);
                const parentWidth = parentEl.clientWidth;
                
                // Use 95% of available width for 10px padding on each side
                const maxWidth = parentWidth * 0.95;
                const height = maxWidth * (11/21); // Apply aspect ratio
                
                el.style.width = `${maxWidth}px`;
                el.style.height = `${height}px`;
                el.style.left = `${(parentWidth - maxWidth) / 2}px`;
                // Remove gap by setting top position to button bottom
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
