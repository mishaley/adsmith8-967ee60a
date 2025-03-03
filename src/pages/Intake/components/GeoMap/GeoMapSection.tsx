
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
    <table className="w-full border-collapse">
      <tbody>
        <tr>
          <td className="border-r p-2 w-1/2 align-top">
            <MapDisplay 
              loading={loading} 
              error={error} 
              mapContainerRef={mapContainer} 
              selectedCountry={selectedCountry} 
              setSelectedCountry={setSelectedCountry} 
            />
          </td>
          <td className="p-2 w-1/2 align-top">
            <div className="font-bold text-lg mb-4">Selections</div>
            {selectedCountry && (
              <div className="p-2 bg-[#f5f9ff] rounded">
                <p className="font-medium">Selected Country:</p>
                <p className="text-[#154851] font-bold">{selectedCountry}</p>
              </div>
            )}
            {!selectedCountry && (
              <div className="text-gray-500 italic">
                No country selected. Click on a country on the map to select it.
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default GeoMapSection;
