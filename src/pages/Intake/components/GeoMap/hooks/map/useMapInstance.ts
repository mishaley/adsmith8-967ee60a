
import { useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import { useMapResize } from './useMapResize';
import { useMapSetup } from './useMapSetup';

interface UseMapInstanceProps {
  mapboxToken: string;
  mapContainer: React.RefObject<HTMLDivElement>;
}

export const useMapInstance = ({
  mapboxToken,
  mapContainer
}: UseMapInstanceProps) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Handle map container resizing
  const { containerWidth } = useMapResize({
    mapContainer,
    map
  });

  // Initialize map
  useMapSetup({
    mapboxToken,
    mapContainer,
    map,
    containerWidth,
    setInitialized,
    setMapError
  });

  return { map, mapError, initialized, setMapError };
};
