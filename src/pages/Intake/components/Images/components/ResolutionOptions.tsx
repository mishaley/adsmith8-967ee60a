
import React, { useRef, useEffect, useState } from "react";

interface ResolutionOptionsProps {
  adPlatform: string;
}

const ResolutionOptions: React.FC<ResolutionOptionsProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

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

  const gridItemStyle = {
    height: `${containerWidth / 3}px`,
    border: '1px solid #e0e0e0',
  };

  // Function to determine if this is a top row cell (index 0, 1, or 2)
  const isTopRow = (index: number) => index < 3;

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
            className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors" 
            style={gridItemStyle}
          >
            {isTopRow(index) && (
              <div className="flex items-start justify-center w-full h-full py-[20px] px-[20px] pb-[100px]">
                <div className="bg-gray-400 aspect-square w-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionOptions;
