
import React, { useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from "./hooks/useMapboxToken";
import { useMapInitialization } from "./hooks/useMapInitialization";
import MapDisplay from "./components/MapDisplay";

interface GeoMapSectionProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const GeoMapSection: React.FC<GeoMapSectionProps> = ({
  selectedCountry,
  setSelectedCountry
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const {
    loading,
    mapboxToken,
    error: tokenError
  } = useMapboxToken();
  const {
    mapError,
    initialized
  } = useMapInitialization({
    mapboxToken,
    mapContainer,
    selectedCountry,
    setSelectedCountry
  });

  // Combine errors from both hooks
  const error = tokenError || mapError;

  // Debug logging
  console.log("GeoMapSection state:", {
    loading,
    hasToken: !!mapboxToken,
    tokenLength: mapboxToken ? mapboxToken.length : 0,
    error,
    initialized
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full">
        <MapDisplay 
          loading={loading} 
          error={error} 
          mapContainerRef={mapContainer} 
          selectedCountry={selectedCountry} 
          setSelectedCountry={setSelectedCountry} 
        />
      </div>
      <div className="w-full bg-[#f5f9ff] rounded-lg p-4 border border-[#d0e1f9]">
        <div className="font-bold text-lg mb-4">Selections</div>
        {selectedCountry ? (
          <div className="p-3 bg-[#f5f9ff] rounded border border-[#d0e1f9]">
            <p className="font-medium">Selected Country:</p>
            <p className="text-[#154851] font-bold">{selectedCountry}</p>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-gray-500">
            No country selected. Click on the map to select a country.
          </div>
        )}
      </div>
    </div>
  );
};

export default GeoMapSection;
