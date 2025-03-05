
import { useState } from "react";
import { useMapInstance } from "./map/useMapInstance";
import { useCountryLayers } from "./map/useCountryLayers";

interface UseMapInitializationProps {
  mapboxToken: string;
  mapContainer: React.RefObject<HTMLDivElement>;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

export const useMapInitialization = ({
  mapboxToken,
  mapContainer,
  selectedCountry,
  setSelectedCountry
}: UseMapInitializationProps) => {
  // Use the separated map instance hook
  const { map, mapError, initialized, setMapError } = useMapInstance({
    mapboxToken,
    mapContainer
  });

  // Use the country layers hook to setup and manage country selection
  useCountryLayers({
    map,
    initialized,
    selectedCountry,
    setSelectedCountry,
    setMapError
  });

  return { mapError, initialized };
};
