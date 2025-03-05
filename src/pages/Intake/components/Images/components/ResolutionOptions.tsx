
import React, { useRef, useEffect, useState } from "react";
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from "../../../utils/localStorageUtils";
import { aspectRatioConfigs } from "../utils/aspectRatioConfig";
import AspectRatioSelector from "./Resolution/AspectRatioSelector";
import LayoutCell from "./Resolution/LayoutCell";

interface ResolutionOptionsProps {
  adPlatform: string;
}

const ResolutionOptions: React.FC<ResolutionOptionsProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState<string>(
    loadFromLocalStorage<string>(STORAGE_KEYS.IMAGES + "_ratio", "1:1")
  );

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        // Set a fixed consistent height for all ratio options
        const height = containerRef.current.offsetWidth / 3;
        setContainerHeight(height);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, [selectedRatio]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.IMAGES + "_ratio", selectedRatio);
  }, [selectedRatio]);

  const handleSelectRatio = (ratio: string) => {
    setSelectedRatio(ratio);
  };

  const currentRatioConfig = aspectRatioConfigs.find(config => config.ratio === selectedRatio) || aspectRatioConfigs[0];

  const gridItemStyle = {
    height: `${containerHeight}px`,
    border: '1px solid #e0e0e0',
  };

  return (
    <div ref={containerRef} className="w-full">
      <AspectRatioSelector 
        aspectRatioConfigs={aspectRatioConfigs}
        selectedRatio={selectedRatio}
        onSelectRatio={handleSelectRatio}
      />

      <div 
        className="grid grid-cols-3 w-full"
        style={{ height: `${containerHeight}px` }}
      >
        {/* Only render the first 3 cells (top row) */}
        {[...Array(3)].map((_, index) => (
          <LayoutCell 
            key={index}
            index={index}
            gridItemStyle={gridItemStyle}
            currentRatioConfig={currentRatioConfig}
          />
        ))}
      </div>
    </div>
  );
};

export default ResolutionOptions;
