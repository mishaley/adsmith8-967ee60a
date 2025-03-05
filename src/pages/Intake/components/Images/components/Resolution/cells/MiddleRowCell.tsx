
import React from "react";
import { Check, X } from "lucide-react";

const MiddleRowCell: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-purple-100 text-purple-800 text-xs font-medium p-1 rounded">
        4:5
      </div>
      
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
            const width = height * (4/5);
            
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
      
      <div 
        className="bg-gray-400 absolute"
        style={{ 
          top: 'auto',
          height: 'auto',
          width: 'auto',
          bottom: 0,
        }}
        ref={(el) => {
          if (el) {
            const parentEl = el.parentElement;
            if (parentEl) {
              const buttons = parentEl.querySelector('.flex.w-full.absolute') as HTMLElement;
              if (buttons) {
                const buttonsHeight = buttons.offsetHeight;
                const buttonsTop = parseInt(buttons.style.top, 10);
                const totalHeight = parentEl.clientHeight;
                const height = totalHeight - (buttonsTop + buttonsHeight);
                const width = height * (4/5);
                
                el.style.height = `${height}px`;
                el.style.width = `${width}px`;
                el.style.left = `${(parentEl.offsetWidth - width) / 2}px`;
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
