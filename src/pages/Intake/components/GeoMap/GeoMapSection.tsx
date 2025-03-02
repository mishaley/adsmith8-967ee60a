
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
  const { loading, mapboxToken, error: tokenError } = useMapboxToken();
  const { mapError } = useMapInitialization({
    mapboxToken,
    mapContainer,
    selectedCountry,
    setSelectedCountry
  });
  
  // Combine errors from both hooks
  const error = tokenError || mapError;

  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Geo Bounds</span>
            {selectedCountry && (
              <div className="ml-4 px-3 py-1 rounded bg-[#154851] text-white text-sm">
                {selectedCountry}
              </div>
            )}
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="p-0">
          <div className="w-full p-4">
            <MapDisplay
              loading={loading}
              error={error}
              mapContainerRef={mapContainer}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default GeoMapSection;
