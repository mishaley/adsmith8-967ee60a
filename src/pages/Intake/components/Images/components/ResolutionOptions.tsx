
import React, { useRef, useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from "../../../utils/localStorageUtils";

interface ResolutionOptionsProps {
  adPlatform: string;
}

// Define aspect ratio configuration types
type AspectRatioConfig = {
  label: string;
  ratio: string;
  width: number;
  height: number;
  description?: string;
};

// Create aspect ratio configurations
const aspectRatioConfigs: AspectRatioConfig[] = [
  { label: "1:1", ratio: "1:1", width: 1, height: 1, description: "Square format - equal width and height" },
  { label: "4:5", ratio: "4:5", width: 4, height: 5, description: "Portrait format - taller than wide" },
  { label: "9:16", ratio: "9:16", width: 9, height: 16, description: "Vertical format - much taller than wide" },
];

const ResolutionOptions: React.FC<ResolutionOptionsProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState<string>(
    loadFromLocalStorage<string>(STORAGE_KEYS.IMAGES + "_ratio", "1:1")
  );

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Save selected ratio to local storage when it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.IMAGES + "_ratio", selectedRatio);
  }, [selectedRatio]);

  const gridItemStyle = {
    height: `${containerWidth / 3}px`,
    border: '1px solid #e0e0e0',
  };

  // Function to determine if this is a top row cell (index 0, 1, or 2)
  const isTopRow = (index: number) => index < 3;

  // Function to determine if this is a middle row cell (index 3, 4, or 5)
  const isMiddleRow = (index: number) => index >= 3 && index < 6;
  
  // Function to determine if this is a bottom row cell (index 6, 7, or 8)
  const isBottomRow = (index: number) => index >= 6;

  return (
    <div 
      ref={containerRef} 
      className="w-full"
      style={{ height: `${containerWidth}px` }}
    >
      <div className="grid grid-cols-3 w-full h-full">
        {[...Array(9)].map((_, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative" 
            style={gridItemStyle}
          >
            {isTopRow(index) && (
              <>
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
                        // Calculate and set width to match height for 1:1 ratio
                        const height = el.parentElement?.clientHeight ? el.parentElement.clientHeight - 20 - 60 : 0;
                        el.style.width = `${height}px`;
                        el.style.left = `${(el.parentElement?.clientWidth ?? 0) / 2 - height / 2}px`;
                      }
                    }}
                  />
                  {/* Add ratio label */}
                  <div className="absolute top-0 left-0 bg-blue-100 text-blue-800 text-xs font-medium p-1 rounded">
                    1:1
                  </div>
                </div>
                
                {/* Bottom boxes container - made perfectly aligned with gray box */}
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
              </>
            )}

            {isMiddleRow(index) && (
              <>
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
                        // For 4:5 ratio, width = height * (4/5)
                        const widthFor4to5 = height * (4/5);
                        el.style.width = `${widthFor4to5}px`;
                        el.style.left = `${(el.parentElement?.clientWidth ?? 0) / 2 - widthFor4to5 / 2}px`;
                      }
                    }}
                  />
                  {/* Add ratio label */}
                  <div className="absolute top-0 left-0 bg-purple-100 text-purple-800 text-xs font-medium p-1 rounded">
                    4:5
                  </div>
                </div>
                
                {/* Bottom boxes container - aligned with 4:5 gray box */}
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
              </>
            )}

            {isBottomRow(index) && (
              <>
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
                        // For 9:16 ratio, width = height * (9/16)
                        const widthFor9to16 = height * (9/16);
                        el.style.width = `${widthFor9to16}px`;
                        el.style.left = `${(el.parentElement?.clientWidth ?? 0) / 2 - widthFor9to16 / 2}px`;
                      }
                    }}
                  />
                  {/* Add ratio label */}
                  <div className="absolute top-0 left-0 bg-green-100 text-green-800 text-xs font-medium p-1 rounded">
                    9:16
                  </div>
                </div>
                
                {/* Bottom boxes container - aligned with 9:16 gray box */}
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionOptions;
