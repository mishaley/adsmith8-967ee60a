
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { adjustMapView } from './utils/viewportUtils';

interface UseMapResizeProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.MutableRefObject<mapboxgl.Map | null>;
}

/**
 * Hook to handle map container resizing
 */
export const useMapResize = ({ 
  mapContainer, 
  map 
}: UseMapResizeProps) => {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    const updateDimensions = () => {
      if (mapContainer.current) {
        const width = mapContainer.current.offsetWidth;
        setContainerWidth(width);
        
        if (map.current) {
          map.current.resize();
          adjustMapView(map.current, width);
        }
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(mapContainer.current);
    
    return () => {
      if (mapContainer.current) {
        resizeObserver.unobserve(mapContainer.current);
      }
      resizeObserver.disconnect();
    };
  }, [mapContainer, map]);

  return { containerWidth };
};
