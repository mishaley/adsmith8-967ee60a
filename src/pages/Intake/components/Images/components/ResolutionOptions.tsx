
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
              <div className="w-full h-full p-5 flex flex-col items-center">
                <div 
                  className="bg-gray-400"
                  style={{ 
                    marginTop: '0',
                    marginBottom: '0',
                    height: '75%',
                    width: '75%',
                    aspectRatio: '1/1'
                  }}
                />
                <div className="flex w-full mt-0">
                  <div className="bg-gray-200 h-[30px] w-1/2"></div>
                  <div className="bg-gray-300 h-[30px] w-1/2"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionOptions;
