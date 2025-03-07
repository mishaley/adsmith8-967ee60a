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
  // Component is inactive, but we'll keep the code with minimal functionality
  const [displayError] = useState<string | null>(null);
  
  // All map health checking is disabled
  // const [mapHealthCheck, setMapHealthCheck] = useState({
  //   status: "pending" as "pending" | "failed" | "healthy",
  //   lastChecked: Date.now()
  // });
  
  // Disabled map health checking
  /*
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
  */
  
  // Handle refresh button click - also disabled
  const handleRefresh = () => {
    toast.info("Map feature is currently disabled", { duration: 2000 });
  };
  
  // Return a placeholder instead of the actual map
  return (
    <div className="w-full">
      <div className="h-[600px] flex flex-col items-center justify-center bg-gray-100 rounded p-4">
        <div className="font-semibold mb-2">Map Temporarily Disabled</div>
        <div className="text-sm text-center max-w-md">
          The map functionality has been temporarily disabled. Please use the dropdown menu to select a country.
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
