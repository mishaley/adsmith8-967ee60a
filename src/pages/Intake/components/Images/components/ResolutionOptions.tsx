
import React, { useRef, useEffect, useState } from "react";
import { aspectRatioConfigs } from "./AspectRatioConfig";
import { AspectRatioRow } from "./AspectRatioRow";
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

  const cellHeight = containerWidth / 3;

  return (
    <div 
      ref={containerRef} 
      className="w-full"
      style={{ height: `${containerWidth}px` }}
    >
      <div className="grid grid-cols-3 w-full h-full">
        {/* First row - 1:1 aspect ratio */}
        <AspectRatioRow config={aspectRatioConfigs[0]} cellHeight={cellHeight} />
        
        {/* Second row - 4:5 aspect ratio */}
        <AspectRatioRow config={aspectRatioConfigs[1]} cellHeight={cellHeight} />
        
        {/* Third row - 9:16 aspect ratio */}
        <AspectRatioRow config={aspectRatioConfigs[2]} cellHeight={cellHeight} />
      </div>
    </div>
  );
};

export default ResolutionOptions;
