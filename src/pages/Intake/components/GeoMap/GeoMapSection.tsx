
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
  return <>
      <tr className="border-b">
        
      </tr>
      <tr>
        <td colSpan={2} className="p-0">
          <div className="w-full px-4 pb-4">
            <MapDisplay loading={loading} error={error} mapContainerRef={mapContainer} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
          </div>
        </td>
      </tr>
    </>;
};
export default GeoMapSection;
