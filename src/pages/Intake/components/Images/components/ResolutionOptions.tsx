
import React, { useRef, useEffect, useState } from "react";
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from "../../../utils/localStorageUtils";
import { aspectRatioConfigs } from "../utils/aspectRatioConfig";
import AspectRatioSelector from "./Resolution/AspectRatioSelector";
import LayoutCell from "./Resolution/LayoutCell";
import ApprovedRow from "./Resolution/ApprovedRow";
import RejectedRow from "./Resolution/RejectedRow";

interface ResolutionOptionsProps {
  adPlatform: string;
}

const ResolutionOptions: React.FC<ResolutionOptionsProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState<string>(
    loadFromLocalStorage<string>(STORAGE_KEYS.IMAGES + "_ratio", "1:1")
  );

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        // Make the cell height equal to 1/3 of width to ensure square cells
        const height = width / 3;
        setCellHeight(height);
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
    height: `${cellHeight}px`,
    width: `${containerWidth / 3}px`,
    border: '1px solid #e0e0e0',
  };

  return (
    <div ref={containerRef} className="w-full bg-transparent">
      <AspectRatioSelector 
        aspectRatioConfigs={aspectRatioConfigs}
        selectedRatio={selectedRatio}
        onSelectRatio={handleSelectRatio}
      />

      {/* Removed extra div wrapper to eliminate gap */}
      <div 
        className="grid grid-cols-3 w-full bg-transparent"
        style={{ height: `${cellHeight}px` }}
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
      
      {/* Approved Row */}
      <ApprovedRow 
        cellHeight={cellHeight} 
        containerWidth={containerWidth}
        currentRatioConfig={currentRatioConfig}
      />
      
      {/* Rejected Row */}
      <RejectedRow 
        cellHeight={cellHeight} 
        containerWidth={containerWidth}
        currentRatioConfig={currentRatioConfig}
      />
    </div>
  );
};

export default ResolutionOptions;
