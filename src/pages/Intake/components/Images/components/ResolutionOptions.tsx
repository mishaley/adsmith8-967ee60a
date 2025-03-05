
import React, { useRef, useEffect, useState } from "react";
import { Check, X, Square, RectangleVertical, LayoutPanelTop, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from "../../../utils/localStorageUtils";

interface ResolutionOptionsProps {
  adPlatform: string;
}

type AspectRatioConfig = {
  label: string;
  ratio: string;
  width: number;
  height: number;
  description?: string;
  icon: React.ReactNode;
};

const aspectRatioConfigs: AspectRatioConfig[] = [
  { 
    label: "1:1", 
    ratio: "1:1", 
    width: 1, 
    height: 1, 
    description: "Square format - equal width and height",
    icon: <Square className="h-4 w-4" />
  },
  { 
    label: "4:5", 
    ratio: "4:5", 
    width: 4, 
    height: 5, 
    description: "Portrait format - taller than wide",
    icon: <RectangleVertical className="h-4 w-4" />
  },
  { 
    label: "9:16", 
    ratio: "9:16", 
    width: 9, 
    height: 16, 
    description: "Vertical format - much taller than wide",
    icon: <LayoutPanelTop className="h-4 w-4" />
  },
  { 
    label: "21:11", 
    ratio: "21:11", 
    width: 21, 
    height: 11, 
    description: "Landscape format - wider than tall",
    icon: <Monitor className="h-4 w-4" />
  },
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

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.IMAGES + "_ratio", selectedRatio);
  }, [selectedRatio]);

  const handleSelectRatio = (ratio: string) => {
    setSelectedRatio(ratio);
  };

  const currentRatioConfig = aspectRatioConfigs.find(config => config.ratio === selectedRatio) || aspectRatioConfigs[0];

  const gridItemStyle = {
    height: `${containerWidth / 3}px`,
    border: '1px solid #e0e0e0',
  };

  const isTopRow = (index: number) => index < 3;
  const isMiddleRow = (index: number) => index >= 3 && index < 6;
  const isBottomRow = (index: number) => index >= 6 && index < 9;
  const isNewBottomRow = (index: number) => index >= 9;

  return (
    <div 
      ref={containerRef} 
      className="w-full"
      style={{ height: `${containerWidth * 4/3}px` }}
    >
      <div className="flex justify-center gap-2 mb-4 p-3 bg-white border-b">
        {aspectRatioConfigs.map((config) => (
          <Button
            key={config.ratio}
            variant={selectedRatio === config.ratio ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelectRatio(config.ratio)}
            className="flex items-center gap-1"
            title={config.description}
          >
            {config.icon}
            {config.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 w-full h-full">
        {[...Array(12)].map((_, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative" 
            style={gridItemStyle}
          >
            {isTopRow(index) && (
              <div className="w-full h-full flex flex-col justify-center items-center relative" style={{ paddingTop: '20px' }}>
                <div className="absolute top-0 left-0 bg-blue-100 text-blue-800 text-xs font-medium p-1 rounded">
                  {currentRatioConfig.ratio}
                </div>
                
                {currentRatioConfig.ratio === "21:11" ? (
                  <>
                    <div 
                      className="flex absolute"
                      style={{ 
                        height: '60px',
                        top: '20px'
                      }}
                      ref={(el) => {
                        if (el) {
                          const parentWidth = el.parentElement?.clientWidth ?? 0;
                          const maxWidth = parentWidth * 0.9; // Use 90% of parent width
                          
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
                      ref={(el) => {
                        if (el) {
                          const parentEl = el.parentElement;
                          if (parentEl) {
                            const buttons = parentEl.querySelector('.flex.absolute') as HTMLElement;
                            if (buttons) {
                              const buttonsHeight = buttons.offsetHeight;
                              const buttonsTop = parseInt(buttons.style.top, 10);
                              const parentWidth = parentEl.clientWidth;
                              
                              const maxWidth = parentWidth * 0.9; // Use 90% of available width
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
                  </>
                ) : (
                  <>
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
                          const width = height * (currentRatioConfig.width / currentRatioConfig.height);
                          
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
                              const width = height * (currentRatioConfig.width / currentRatioConfig.height);
                              
                              el.style.height = `${height}px`;
                              el.style.width = `${width}px`;
                              el.style.left = `${(parentEl.offsetWidth - width) / 2}px`;
                              el.style.top = `${buttonsTop + buttonsHeight}px`;
                            }
                          }
                        }
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {isMiddleRow(index) && (
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
            )}

            {isBottomRow(index) && (
              <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
                <div className="absolute top-0 left-0 bg-green-100 text-green-800 text-xs font-medium p-1 rounded">
                  9:16
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
                          const width = height * (9/16);
                          
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
            )}

            {isNewBottomRow(index) && (
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
                      const maxWidth = parentWidth * 0.9; // Use 90% of parent width
                      
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
                          
                          const maxWidth = parentWidth * 0.9; // Use 90% of available width
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionOptions;
