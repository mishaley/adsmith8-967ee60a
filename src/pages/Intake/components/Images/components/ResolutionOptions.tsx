
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
  { label: "21:11", ratio: "21:11", width: 21, height: 11, description: "Landscape format - wider than tall" },
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
  const isBottomRow = (index: number) => index >= 6 && index < 9;
  
  // Function to determine if this is a new bottom row cell (index 9, 10, or 11)
  const isNewBottomRow = (index: number) => index >= 9;

  return (
    <div 
      ref={containerRef} 
      className="w-full"
      style={{ height: `${containerWidth * 4/3}px` }} // Updated to accommodate 4 rows
    >
      <div className="grid grid-cols-3 w-full h-full">
        {[...Array(12)].map((_, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative" 
            style={gridItemStyle}
          >
            {isTopRow(index) && (
              <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
                {/* Add ratio label */}
                <div className="absolute top-0 left-0 bg-blue-100 text-blue-800 text-xs font-medium p-1 rounded">
                  1:1
                </div>
                
                {/* Buttons - positioned at the top (20px from top) */}
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
                      const width = height;
                      
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
                
                {/* Gray box - positioned below the buttons */}
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
                          // Height calculation: total height - (buttons top + buttons height)
                          const height = totalHeight - (buttonsTop + buttonsHeight);
                          el.style.height = `${height}px`;
                          el.style.width = `${height}px`;
                          el.style.left = `${(parentEl.offsetWidth - height) / 2}px`;
                          
                          // Position below buttons
                          el.style.top = `${buttonsTop + buttonsHeight}px`;
                        }
                      }
                    }
                  }}
                />
              </div>
            )}

            {isMiddleRow(index) && (
              <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
                {/* Add ratio label */}
                <div className="absolute top-0 left-0 bg-purple-100 text-purple-800 text-xs font-medium p-1 rounded">
                  4:5
                </div>
                
                {/* Buttons - positioned at the top (20px from top) */}
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
                      // For 4:5 ratio
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
                
                {/* Gray box - positioned below the buttons */}
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
                          // Height calculation: total height - (buttons top + buttons height)
                          const height = totalHeight - (buttonsTop + buttonsHeight);
                          // Width for 4:5 ratio
                          const width = height * (4/5);
                          
                          el.style.height = `${height}px`;
                          el.style.width = `${width}px`;
                          el.style.left = `${(parentEl.offsetWidth - width) / 2}px`;
                          
                          // Position below buttons
                          el.style.top = `${buttonsTop + buttonsHeight}px`;
                        }
                      }
                    }
                  }}
                />
              </div>
            )}

            {isBottomRow(index) && (
              <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
                {/* Add ratio label */}
                <div className="absolute top-0 left-0 bg-green-100 text-green-800 text-xs font-medium p-1 rounded">
                  9:16
                </div>
                
                {/* Buttons - positioned at the top (20px from top) */}
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
                      // For 9:16 ratio
                      const width = height * (9/16);
                      
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
                
                {/* Gray box - positioned below the buttons */}
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
                          // Height calculation: total height - (buttons top + buttons height)
                          const height = totalHeight - (buttonsTop + buttonsHeight);
                          // Width for 9:16 ratio
                          const width = height * (9/16);
                          
                          el.style.height = `${height}px`;
                          el.style.width = `${width}px`;
                          el.style.left = `${(parentEl.offsetWidth - width) / 2}px`;
                          
                          // Position below buttons
                          el.style.top = `${buttonsTop + buttonsHeight}px`;
                        }
                      }
                    }
                  }}
                />
              </div>
            )}

            {isNewBottomRow(index) && (
              <div className="w-full h-full flex flex-col justify-start relative" style={{ paddingTop: '20px' }}>
                {/* Add ratio label */}
                <div className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-xs font-medium p-1 rounded">
                  21:11
                </div>
                
                {/* Buttons - positioned at the top (20px from top) */}
                <div 
                  className="flex w-full absolute"
                  style={{ 
                    height: '60px',
                    top: '20px',
                  }}
                  ref={(el) => {
                    if (el) {
                      // For 21:11 ratio (landscape)
                      // We'll use full width and then calculate height based on ratio
                      const width = el.parentElement?.clientWidth ? el.parentElement.clientWidth - 20 : 0;
                      const height = width * (11/21);
                      
                      el.style.width = `${width}px`;
                      el.style.height = `${height}px`;
                      el.style.left = `10px`; // 10px margin on left
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
                
                {/* Gray box - positioned below the buttons */}
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
                          
                          // For 21:11 ratio - using cell width as reference
                          const width = parentEl.clientWidth - 20; // 10px margin on each side
                          const height = width * (11/21);
                          
                          el.style.width = `${width}px`;
                          el.style.height = `${height}px`;
                          el.style.left = `10px`; // 10px margin on left
                          
                          // Position below buttons
                          el.style.top = `${buttonsTop + buttonsHeight}px`;
                        }
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionOptions;
