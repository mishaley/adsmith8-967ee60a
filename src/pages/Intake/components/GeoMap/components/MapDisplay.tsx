
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface MapDisplayProps {
  loading: boolean;
  error: string | null;
  mapContainerRef: React.RefObject<HTMLDivElement>;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  loading,
  error,
  mapContainerRef,
  selectedCountry,
  setSelectedCountry
}) => {
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded">
        <Loader className="h-8 w-8 animate-spin text-[#154851]" />
        <div className="ml-2">Loading map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center bg-gray-100 rounded text-red-500 p-4">
        <div className="font-semibold mb-2">Error loading map</div>
        <div className="text-sm text-center">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="h-[300px] rounded overflow-hidden border border-gray-300 relative">
        <div ref={mapContainerRef} className="absolute inset-0" />
        {selectedCountry && (
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCountry('')}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Click on a country to select it as your geo boundary
      </div>
    </>
  );
};

export default MapDisplay;
