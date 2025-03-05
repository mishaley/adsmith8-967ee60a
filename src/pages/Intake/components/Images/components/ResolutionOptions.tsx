
import React, { useRef, useEffect } from "react";

interface ResolutionOptionsProps {
  adPlatform: string;
}

const ResolutionOptions: React.FC<ResolutionOptionsProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Effect to set height equal to width
  useEffect(() => {
    const setSquareHeight = () => {
      const container = containerRef.current;
      if (container) {
        const width = container.offsetWidth;
        container.style.height = `${width}px`;
      }
    };
    
    // Set initial height
    setSquareHeight();
    
    // Set height on resize
    window.addEventListener('resize', setSquareHeight);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setSquareHeight);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-white rounded-md"></div>
  );
};

export default ResolutionOptions;
