
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// This edge function serves a simplified GeoJSON of world countries
// In production, this would fetch from a database or file storage
serve(async (req) => {
  try {
    // In a real implementation, we would fetch a proper GeoJSON from a database or storage
    // For now, we'll use a simplified version with just a few countries as an example
    
    // This is where you would fetch or read your actual GeoJSON data
    // In a production system, this would be a complete world GeoJSON with:
    // 1. Simplified boundaries for better performance
    // 2. ISO codes and country names in properties
    // 3. Unique IDs for each feature
    
    const countriesGeoJSON = {
      type: "FeatureCollection",
      features: [
        // Sample GeoJSON features - in production this would be a complete dataset
        {
          type: "Feature",
          properties: {
            NAME: "United States",
            ISO_A2: "US",
            ISO_A3: "USA"
          },
          geometry: {
            type: "MultiPolygon",
            coordinates: [[[[-125, 48], [-125, 32], [-110, 32], [-110, 48], [-125, 48]]]]
          },
          id: "USA"
        },
        {
          type: "Feature",
          properties: {
            NAME: "Brazil",
            ISO_A2: "BR",
            ISO_A3: "BRA"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[[-60, 5], [-60, -30], [-40, -30], [-40, 5], [-60, 5]]]
          },
          id: "BRA"
        },
        {
          type: "Feature",
          properties: {
            NAME: "Germany",
            ISO_A2: "DE",
            ISO_A3: "DEU"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[[8, 54], [8, 47], [15, 47], [15, 54], [8, 54]]]
          },
          id: "DEU"
        },
        // In a real implementation, this would include all countries
      ]
    };

    return new Response(
      JSON.stringify(countriesGeoJSON),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in get-countries-geojson function:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to get countries GeoJSON data" }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
