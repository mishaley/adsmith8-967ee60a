
import React, { useRef, useEffect } from "react";
import { Check, X } from "lucide-react";

interface AspectRatioCellProps {
  ratio: string;
  width: number;
  height: number;
  label: string;
  colorScheme: {
    bg: string;
    text: string;
  }
}

export const AspectRatioCell: React.FC<AspectRatioCellProps> = ({ 
  ratio, 
  width, 
  height,
  label,
  colorScheme
}) => {
  return (
    <div className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative" 
         style={{ 
           height: "100%",
           border: '1px solid #e0e0e0',
         }}>
      <div className="w-full h-full flex items-start justify-center relative" style={{ paddingTop: '20px' }}>
        <div 
          className="bg-gray-400 absolute"
          style={{ 
            top: '20px',
            bottom: '60px',
            height: 'auto',
            width: 'auto',
          }}
          ref={(el) => {
            if (el) {
              // Calculate height first
              const height = el.parentElement?.clientHeight ? el.parentElement.clientHeight - 20 - 60 : 0;
              // Calculate width based on the aspect ratio
              const cellWidth = height * (width/height);
              el.style.width = `${cellWidth}px`;
              el.style.left = `${(el.parentElement?.clientWidth ?? 0) / 2 - cellWidth / 2}px`;
            }
          }}
        />
        {/* Ratio label */}
        <div className={`absolute top-0 left-0 ${colorScheme.bg} ${colorScheme.text} text-xs font-medium p-1 rounded`}>
          {label}
        </div>
      </div>
      
      {/* Bottom boxes container - aligned with gray box */}
      <div 
        className="flex absolute bottom-0 w-full"
        style={{ 
          height: '60px', 
          left: '0',
        }}
        ref={(el) => {
          if (el) {
            const parentEl = el.parentElement;
            if (parentEl) {
              const grayBox = parentEl.querySelector('.bg-gray-400') as HTMLElement;
              if (grayBox && grayBox.offsetWidth) {
                // Set the width of the boxes container to exactly match the gray box width
                const grayBoxWidth = grayBox.offsetWidth;
                el.style.width = `${grayBoxWidth}px`;
                // Center this element to match the gray box positioning
                el.style.left = `${(parentEl.offsetWidth - grayBoxWidth) / 2}px`;
              }
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
  );
};
