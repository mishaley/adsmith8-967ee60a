
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

const ResolutionOptions: React.FC<ResolutionOptionsProps> = ({ adPlatform }) => {
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

  // Filter aspect ratio configs based on platform
  const filteredAspectRatios = React.useMemo(() => {
    if (adPlatform === "Google") {
      return aspectRatioConfigs.filter(config => 
        ["1:1", "4:5", "21:11"].includes(config.ratio)
      );
    } else if (adPlatform === "Meta") {
      return aspectRatioConfigs.filter(config => 
        ["1:1", "4:5", "9:16"].includes(config.ratio)
      );
    }
    return aspectRatioConfigs; // Default fallback
  }, [adPlatform]);

  const handleSelectRatio = (ratio: string) => {
    setSelectedRatio(ratio);
  };

  // Ensure selectedRatio is among the filtered options
  useEffect(() => {
    if (filteredAspectRatios.length > 0 && !filteredAspectRatios.some(config => config.ratio === selectedRatio)) {
      setSelectedRatio(filteredAspectRatios[0].ratio);
    }
  }, [filteredAspectRatios, selectedRatio]);

  const currentRatioConfig = aspectRatioConfigs.find(config => config.ratio === selectedRatio) || aspectRatioConfigs[0];

  const gridItemStyle = {
    height: `${cellHeight}px`,
    width: `${containerWidth / 3}px`,
    border: '1px solid transparent',
  };

  return (
    <div ref={containerRef} className="w-full bg-transparent">
      <AspectRatioSelector 
        aspectRatioConfigs={filteredAspectRatios}
        selectedRatio={selectedRatio}
        onSelectRatio={handleSelectRatio}
      />
      
      {/* Transparent spacer row above image review section - 20px height */}
      <div className="w-full h-[20px] bg-transparent"></div>

      <div 
        className="grid grid-cols-3 w-full bg-transparent border-transparent"
        style={{ height: `${cellHeight}px` }}
      >
        {[...Array(3)].map((_, index) => (
          <LayoutCell 
            key={index}
            index={index}
            gridItemStyle={gridItemStyle}
            currentRatioConfig={currentRatioConfig}
          />
        ))}
      </div>
      
      {/* Transparent spacer row - 20px height */}
      <div className="w-full h-[20px] bg-transparent"></div>
      
      <ApprovedRow 
        cellHeight={cellHeight} 
        containerWidth={containerWidth}
        currentRatioConfig={currentRatioConfig}
      />
      
      <RejectedRow 
        cellHeight={cellHeight} 
        containerWidth={containerWidth}
        currentRatioConfig={currentRatioConfig}
      />
    </div>
  );
};

export default ResolutionOptions;
