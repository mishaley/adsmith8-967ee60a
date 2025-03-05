
import React, { useRef } from "react";
import { AspectRatioConfig } from "../../../utils/aspectRatioConfig";
import { WideAspectButtons, StandardAspectButtons } from "./AspectButtons";
import { WideAspectDisplay, StandardAspectDisplay } from "./AspectDisplay";

interface TopRowCellProps {
  currentRatioConfig: AspectRatioConfig;
}

const TopRowCell: React.FC<TopRowCellProps> = ({ currentRatioConfig }) => {
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  const isWideAspect = currentRatioConfig.ratio === "21:11";

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-blue-100 text-blue-800 text-xs font-medium p-1 rounded">
        {currentRatioConfig.ratio}
      </div>
      
      <div 
        ref={buttonsRef} 
        className="w-full"
      >
        {isWideAspect ? (
          <WideAspectButtons currentRatioConfig={currentRatioConfig} />
        ) : (
          <StandardAspectButtons currentRatioConfig={currentRatioConfig} />
        )}
      </div>
      
      {isWideAspect ? (
        <WideAspectDisplay 
          currentRatioConfig={currentRatioConfig} 
          buttonsRef={buttonsRef.current} 
        />
      ) : (
        <StandardAspectDisplay 
          currentRatioConfig={currentRatioConfig} 
          buttonsRef={buttonsRef.current} 
        />
      )}
    </div>
  );
};

export { TopRowCell };
