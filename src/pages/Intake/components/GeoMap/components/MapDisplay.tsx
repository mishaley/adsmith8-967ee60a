
import React from "react";
import { Loader, AlertCircle } from "lucide-react";

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
    return <div className="h-[450px] flex items-center justify-center bg-gray-100 rounded">
        <Loader className="h-8 w-8 animate-spin text-[#154851]" />
        <div className="ml-2">Loading map...</div>
      </div>;
  }
  
  if (error) {
    return <div className="h-[450px] flex flex-col items-center justify-center bg-gray-100 rounded text-red-500 p-4">
        <AlertCircle className="h-8 w-8 mb-2" />
        <div className="font-semibold mb-2">Error loading map</div>
        <div className="text-sm text-center max-w-md">{error}</div>
        <div className="text-xs text-gray-500 mt-4 text-center">
          Please ensure the MAPBOX_TOKEN is correctly set in Supabase Edge Function Secrets
        </div>
      </div>;
  }
  
  return <div className="w-full">
      <div className="h-[450px] overflow-hidden relative rounded">
        <div 
          ref={mapContainerRef} 
          className="absolute inset-0 w-full" 
          style={{ 
            marginLeft: "0", 
            width: "calc(100% + 8px)" 
          }} 
        />
      </div>
    </div>;
};

export default MapDisplay;
