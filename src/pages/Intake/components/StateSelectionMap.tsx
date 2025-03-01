
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StateSelectionMapProps {
  value: string;
  onChange: (value: string) => void;
}

// Fallback: localStorage key for storing the Mapbox token when not using Supabase
const MAPBOX_TOKEN_KEY = "mapbox_access_token";

const StateSelectionMap = ({ value, onChange }: StateSelectionMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(
    localStorage.getItem(MAPBOX_TOKEN_KEY) || ""
  );
  const [tokenLoading, setTokenLoading] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>(
    value ? value.split(", ") : []
  );
  const [mapInitialized, setMapInitialized] = useState(false);

  // Try to fetch the Mapbox token from Supabase secrets on component mount
  useEffect(() => {
    const fetchMapboxToken = async () => {
      setTokenLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("get-mapbox-token");
        if (error) {
          console.error("Error fetching Mapbox token:", error);
          // Fallback to localStorage if there's an error
          const savedToken = localStorage.getItem(MAPBOX_TOKEN_KEY);
          if (savedToken) {
            setMapboxToken(savedToken);
          }
        } else if (data?.mapboxToken) {
          setMapboxToken(data.mapboxToken);
          // Still save to localStorage as a fallback
          localStorage.setItem(MAPBOX_TOKEN_KEY, data.mapboxToken);
        }
      } catch (err) {
        console.error("Failed to fetch Mapbox token:", err);
      } finally {
        setTokenLoading(false);
      }
    };

    // Only try to fetch if we don't already have a token
    if (!mapboxToken) {
      fetchMapboxToken();
    }
  }, []);

  // For demo purposes, allow users to input their Mapbox token
  const handleTokenChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setMapboxToken(newToken);
    
    // Save the token to localStorage as a fallback
    if (newToken) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, newToken);
      
      // Also try to save to Supabase secrets
      try {
        const { error } = await supabase.functions.invoke("save-mapbox-token", {
          body: { mapboxToken: newToken },
        });
        
        if (error) {
          console.error("Error saving Mapbox token to secrets:", error);
          toast.error("Failed to save token to secure storage.");
        } else {
          toast.success("Token saved securely!");
        }
      } catch (err) {
        console.error("Failed to save Mapbox token to secrets:", err);
      }
    }
  };

  // Initialize the map when the token is provided
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Clear any existing map instance
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    mapboxgl.accessToken = mapboxToken;

    // Create a new map instance
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-95.7129, 37.0902], // Center of US
      zoom: 3,
    });

    map.current = newMap;

    // Wait for map to load before adding sources and layers
    newMap.on("load", () => {
      setMapInitialized(true);
      
      // Add source for US states
      newMap.addSource("states", {
        type: "vector",
        url: "mapbox://mapbox.us_census_states_2015",
      });

      // Add layer for state fills
      newMap.addLayer({
        id: "states-fills",
        type: "fill",
        source: "states",
        "source-layer": "states",
        paint: {
          "fill-color": [
            "case",
            ["in", ["get", "NAME"], ["literal", selectedStates]],
            "#4f46e5", // Selected state color
            "#ededed", // Default state color
          ],
          "fill-opacity": 0.5,
        },
      });

      // Add layer for state boundaries
      newMap.addLayer({
        id: "states-borders",
        type: "line",
        source: "states",
        "source-layer": "states",
        paint: {
          "line-color": "#627BC1",
          "line-width": 1,
        },
      });

      // Add hover effect
      newMap.addLayer({
        id: "states-fills-hover",
        type: "fill",
        source: "states",
        "source-layer": "states",
        paint: {
          "fill-color": "#627BC1",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.7,
            0,
          ],
        },
      });

      let hoveredStateId: string | null = null;

      // Handle mouse move over states
      newMap.on("mousemove", "states-fills", (e) => {
        if (e.features && e.features.length > 0) {
          if (hoveredStateId) {
            newMap.setFeatureState(
              { source: "states", sourceLayer: "states", id: hoveredStateId },
              { hover: false }
            );
          }
          hoveredStateId = e.features[0].id as string;
          newMap.setFeatureState(
            { source: "states", sourceLayer: "states", id: hoveredStateId },
            { hover: true }
          );
        }
      });

      // Handle click on states
      newMap.on("click", "states-fills", (e) => {
        if (e.features && e.features.length > 0) {
          const stateName = e.features[0].properties?.NAME;
          if (stateName) {
            let newSelectedStates: string[];
            
            if (selectedStates.includes(stateName)) {
              // If already selected, remove it
              newSelectedStates = selectedStates.filter((state) => state !== stateName);
            } else {
              // Otherwise, add it
              newSelectedStates = [...selectedStates, stateName];
            }
            
            setSelectedStates(newSelectedStates);
            onChange(newSelectedStates.join(", "));
            
            // Update the map fill layer
            newMap.setPaintProperty("states-fills", "fill-color", [
              "case",
              ["in", ["get", "NAME"], ["literal", newSelectedStates]],
              "#4f46e5", // Selected state color
              "#ededed", // Default state color
            ]);
          }
        }
      });

      // Reset hover state when mouse leaves
      newMap.on("mouseleave", "states-fills", () => {
        if (hoveredStateId) {
          newMap.setFeatureState(
            { source: "states", sourceLayer: "states", id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
      });
    });

    // Force map to resize after initialization
    setTimeout(() => {
      if (map.current) {
        map.current.resize();
      }
    }, 100);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Update map when selectedStates changes from outside
  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    const currentStates = selectedStates;
    const newStates = value ? value.split(", ") : [];
    
    if (JSON.stringify(currentStates) !== JSON.stringify(newStates)) {
      setSelectedStates(newStates);
      
      map.current.setPaintProperty("states-fills", "fill-color", [
        "case",
        ["in", ["get", "NAME"], ["literal", newStates]],
        "#4f46e5", // Selected state color
        "#ededed", // Default state color
      ]);
    }
  }, [value, mapInitialized]);

  // Force a resize when the container dimensions change
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        map.current.resize();
      }
    });

    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    return () => {
      if (mapContainer.current) {
        resizeObserver.unobserve(mapContainer.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2 w-full">
      {tokenLoading ? (
        <div className="text-sm">Loading Mapbox token...</div>
      ) : !mapboxToken ? (
        <div className="mb-2 w-full">
          <input
            type="text"
            placeholder="Enter your Mapbox public token"
            onChange={handleTokenChange}
            className="w-full p-2 border rounded text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get a token from{" "}
            <a
              href="https://account.mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      ) : null}
      <div
        ref={mapContainer}
        className="w-1/2 h-64 rounded-md border"
        style={{ display: mapboxToken ? "block" : "none" }}
      />
      <div className="text-sm">
        <div className="font-medium mb-1">Selected states:</div>
        <div className="text-gray-600">
          {selectedStates.length > 0
            ? selectedStates.join(", ")
            : "No states selected"}
        </div>
      </div>
    </div>
  );
};

export default StateSelectionMap;
