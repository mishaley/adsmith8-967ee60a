
import React, { useRef, useEffect, useState } from "react";
import { aspectRatioConfigs } from "./AspectRatioConfig";
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from "../../../utils/localStorageUtils";

interface ResolutionOptionsProps {
  adPlatform: string;
}

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

  const handleSelectRatio = (ratio: string) => {
    setSelectedRatio(ratio);
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full p-4"
    >
      <div className="grid grid-cols-3 gap-4 w-full">
        {aspectRatioConfigs.map((config, index) => (
          <div 
            key={config.ratio}
            className={`border rounded-md p-2 cursor-pointer transition-all ${selectedRatio === config.ratio ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}
            onClick={() => handleSelectRatio(config.ratio)}
          >
            <div className="text-center mb-2">
              <span className={`inline-block px-2 py-1 rounded ${config.colorScheme.bg} ${config.colorScheme.text} text-sm font-medium`}>
                {config.label}
              </span>
            </div>

            {/* Aspect ratio visual with container */}
            <div className="relative flex justify-center items-center h-32 mb-2">
              <div 
                className="bg-gray-400 absolute"
                style={{ 
                  width: `${100 * (config.width / Math.max(config.width, config.height))}%`,
                  height: `${100 * (config.height / Math.max(config.width, config.height))}%`,
                  maxHeight: "80%"
                }}
              />
            </div>

            {/* Buttons for each aspect ratio */}
            <div className="flex w-full border-t pt-2">
              <div className="w-1/2 border-r pr-1 flex justify-center">
                <button className="text-red-600 hover:bg-red-50 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>
              <div className="w-1/2 pl-1 flex justify-center">
                <button className="text-blue-800 hover:bg-blue-50 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionOptions;
