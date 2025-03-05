
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
      
      {isWideAspect ? (
        <>
          <div ref={el => {
            buttonsRef.current = el;
            // Force reflow to ensure the ref is updated before AspectDisplay tries to use it
            if (el) el.getBoundingClientRect();
          }}>
            <WideAspectButtons currentRatioConfig={currentRatioConfig} />
          </div>
          <WideAspectDisplay 
            currentRatioConfig={currentRatioConfig} 
            buttonsRef={buttonsRef.current} 
          />
        </>
      ) : (
        <>
          <div ref={el => {
            buttonsRef.current = el;
            // Force reflow to ensure the ref is updated before AspectDisplay tries to use it
            if (el) el.getBoundingClientRect();
          }}>
            <StandardAspectButtons currentRatioConfig={currentRatioConfig} />
          </div>
          <StandardAspectDisplay 
            currentRatioConfig={currentRatioConfig} 
            buttonsRef={buttonsRef.current} 
          />
        </>
      )}
    </div>
  );
};

export { TopRowCell };
