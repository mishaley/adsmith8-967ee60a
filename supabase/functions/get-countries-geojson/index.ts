
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// This edge function serves a simplified GeoJSON of world countries
serve(async (req) => {
  try {
    // In a real implementation, we would fetch a proper GeoJSON from a database or storage
    // For now, we'll use a simplified version with just a few countries as an example
    
    const countriesGeoJSON = {
      type: "FeatureCollection",
      features: [
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
        {
          type: "Feature",
          properties: {
            NAME: "Mexico",
            ISO_A2: "MX",
            ISO_A3: "MEX"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[[-105, 25], [-105, 15], [-95, 15], [-95, 25], [-105, 25]]]
          },
          id: "MEX"
        },
        {
          type: "Feature",
          properties: {
            NAME: "Japan",
            ISO_A2: "JP",
            ISO_A3: "JPN"
          },
          geometry: {
            type: "MultiPolygon",
            coordinates: [[[[140, 45], [140, 35], [145, 35], [145, 45], [140, 45]]]]
          },
          id: "JPN"
        },
        {
          type: "Feature",
          properties: {
            NAME: "India",
            ISO_A2: "IN",
            ISO_A3: "IND"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[[70, 35], [70, 8], [90, 8], [90, 35], [70, 35]]]
          },
          id: "IND"
        },
        {
          type: "Feature",
          properties: {
            NAME: "France",
            ISO_A2: "FR",
            ISO_A3: "FRA"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[[0, 51], [0, 42], [8, 42], [8, 51], [0, 51]]]
          },
          id: "FRA"
        },
        {
          type: "Feature",
          properties: {
            NAME: "United Kingdom",
            ISO_A2: "GB",
            ISO_A3: "GBR"
          },
          geometry: {
            type: "MultiPolygon",
            coordinates: [[[[-5, 58], [-5, 50], [2, 50], [2, 58], [-5, 58]]]]
          },
          id: "GBR"
        },
        {
          type: "Feature",
          properties: {
            NAME: "Australia",
            ISO_A2: "AU",
            ISO_A3: "AUS"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[[115, -10], [115, -40], [155, -40], [155, -10], [115, -10]]]
          },
          id: "AUS"
        },
        {
          type: "Feature",
          properties: {
            NAME: "Canada",
            ISO_A2: "CA",
            ISO_A3: "CAN"
          },
          geometry: {
            type: "MultiPolygon",
            coordinates: [[[[-140, 70], [-140, 48], [-55, 48], [-55, 70], [-140, 70]]]]
          },
          id: "CAN"
        }
        // In a production system, this would be a complete world GeoJSON
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
