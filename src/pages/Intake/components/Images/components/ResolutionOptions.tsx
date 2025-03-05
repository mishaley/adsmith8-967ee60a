
import React, { useRef, useEffect, useState } from "react";
import { Check, X } from "lucide-react";

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
            className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative" 
            style={gridItemStyle}
          >
            {isTopRow(index) && (
              <>
                <div className="w-full h-full flex items-start justify-center relative" style={{ paddingTop: '20px' }}>
                  <div 
                    className="bg-gray-400 absolute"
                    style={{ 
                      top: '20px',
                      bottom: '60px',  // Make bottom flush with the top of the two boxes
                      height: 'auto',
                      width: 'auto',  // Will be calculated dynamically with JS
                    }}
                    ref={(el) => {
                      if (el) {
                        // Calculate and set width to match height
                        const height = el.parentElement?.clientHeight ? el.parentElement.clientHeight - 20 - 60 : 0;
                        el.style.width = `${height}px`;
                        el.style.left = `${(el.parentElement?.clientWidth ?? 0) / 2 - height / 2}px`;
                      }
                    }}
                  />
                </div>
                <div 
                  className="flex absolute bottom-0 w-full"
                  ref={(el) => {
                    if (el) {
                      // Get the width of the gray box above
                      const parentEl = el.parentElement;
                      if (parentEl) {
                        const grayBox = parentEl.querySelector('.bg-gray-400') as HTMLElement;
                        if (grayBox && grayBox.offsetWidth) {
                          // Set the width of this container to match the gray box width
                          el.style.width = `${grayBox.offsetWidth}px`;
                          // Center this element
                          el.style.left = `${(parentEl.offsetWidth - grayBox.offsetWidth) / 2}px`;
                        }
                      }
                    }
                  }}
                >
                  <div className="bg-white h-[60px] w-1/2 border border-gray-700 flex items-center justify-center">
                    <X size={24} color="#990000" />
                  </div>
                  <div className="bg-white h-[60px] w-1/2 border border-gray-700 flex items-center justify-center">
                    <Check size={24} color="#0c343d" />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResolutionOptions;
