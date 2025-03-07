
import React, { useState, useEffect } from "react";
import { Loader, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [displayError, setDisplayError] = useState<string | null>(error);
  const [mapHealthCheck, setMapHealthCheck] = useState({
    status: "pending" as "pending" | "failed" | "healthy",
    lastChecked: Date.now()
  });
  
  // Update displayed error when error prop changes
  useEffect(() => {
    setDisplayError(error);
  }, [error]);
  
  // Check map health periodically
  useEffect(() => {
    if (loading || error) return;
    
    // Check if map container has rendered content
    const checkMapHealth = () => {
      if (!mapContainerRef.current) return;
      
      // Map should have child elements if properly rendered
      const hasChildren = mapContainerRef.current.childNodes.length > 0;
      
      // Check if the map canvas element exists
      const hasCanvas = !!mapContainerRef.current.querySelector('canvas');
      
      if (!hasChildren || !hasCanvas) {
        console.log("Map health check failed: Map container is empty or missing canvas");
        setMapHealthCheck({
          status: "failed",
          lastChecked: Date.now()
        });
      } else {
        console.log("Map health check passed: Map container has content");
        setMapHealthCheck({
          status: "healthy",
          lastChecked: Date.now()
        });
      }
    };
    
    // Initial check after a delay to allow for rendering
    const initialCheckTimer = setTimeout(checkMapHealth, 3000);
    
    // Periodic checks
    const intervalTimer = setInterval(checkMapHealth, 10000);
    
    return () => {
      clearTimeout(initialCheckTimer);
      clearInterval(intervalTimer);
    };
  }, [loading, error, mapContainerRef]);
  
  // Handle refresh button click
  const handleRefresh = () => {
    toast.info("Refreshing map...", { duration: 2000 });
    
    // Force page refresh to reload the map
    window.location.reload();
  };
  
  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded">
        <Loader className="h-8 w-8 animate-spin text-[#154851]" />
        <div className="ml-2">Loading map...</div>
      </div>
    );
  }
  
  if (displayError) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center bg-gray-100 rounded text-red-500 p-4">
        <AlertCircle className="h-8 w-8 mb-2" />
        <div className="font-semibold mb-2">Error loading map</div>
        <div className="text-sm text-center max-w-md">{displayError}</div>
        <div className="text-xs text-gray-500 mt-4 text-center">
          Please ensure the MAPBOX_TOKEN is correctly set in Supabase Edge Function Secrets
        </div>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Map
        </Button>
      </div>
    );
  }
  
  // Show recovery UI if map health check failed
  if (mapHealthCheck.status === "failed") {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center bg-gray-100 rounded p-4">
        <AlertCircle className="h-8 w-8 mb-2 text-amber-500" />
        <div className="font-semibold mb-2">Map is not displaying correctly</div>
        <div className="text-sm text-center max-w-md">
          The map appears to have loaded but isn't rendering properly.
        </div>
        <Button 
          variant="default" 
          className="mt-4 bg-[#154851] hover:bg-[#0d2e33]" 
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reload Map
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="h-[600px] overflow-hidden relative rounded">
        <div ref={mapContainerRef} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default MapDisplay;
