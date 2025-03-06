
import { supabase } from "@/integrations/supabase/client";

// Cache for the GeoJSON data to avoid multiple fetches
let cachedGeoJSON: any = null;

/**
 * Fetch countries GeoJSON data with caching and multiple fallback sources
 */
export const getCountriesGeoJSON = async (): Promise<any> => {
  // Return cached data if available
  if (cachedGeoJSON) {
    console.log("Using cached GeoJSON data");
    return cachedGeoJSON;
  }
  
  try {
    console.log("Fetching countries GeoJSON from Supabase function");
    
    // First attempt: Try to fetch from Supabase function
    const { data: geoJSONData, error } = await supabase.functions.invoke('get-countries-geojson');
    
    if (error) {
      throw new Error(`Supabase function error: ${error.message}`);
    }
    
    if (geoJSONData && typeof geoJSONData === 'object') {
      console.log("Successfully loaded GeoJSON data from Supabase function");
      cachedGeoJSON = geoJSONData;
      return geoJSONData;
    }
    
    throw new Error("Invalid GeoJSON data from Supabase function");
  } catch (primaryError) {
    console.error("Error fetching from primary source:", primaryError);
    
    try {
      // Fallback: Try to fetch from public URL (Natural Earth data)
      console.log("Attempting to fetch from fallback source (Github)");
      const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const geoJSONData = await response.json();
      console.log("Successfully loaded GeoJSON data from fallback source");
      cachedGeoJSON = geoJSONData;
      return geoJSONData;
    } catch (fallbackError) {
      console.error("Error fetching from fallback source:", fallbackError);
      
      try {
        // Second fallback: Try another public source
        console.log("Attempting to fetch from secondary fallback source");
        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const topoJSONData = await response.json();
        
        // Convert from TopoJSON to GeoJSON if necessary
        // This is a simplified conversion - in a real app you'd use topojson-client library
        const geoJSONData = {
          type: "FeatureCollection",
          features: topoJSONData.objects.countries.geometries.map((geometry: any) => ({
            type: "Feature",
            properties: {
              NAME: geometry.properties.name,
              ISO_A2: geometry.properties.iso_a2,
              ISO_A3: geometry.properties.iso_a3
            },
            geometry: geometry
          }))
        };
        
        console.log("Successfully converted and loaded GeoJSON from secondary fallback");
        cachedGeoJSON = geoJSONData;
        return geoJSONData;
      } catch (secondaryFallbackError) {
        console.error("Error fetching from secondary fallback:", secondaryFallbackError);
        
        // Last resort: Use minimal built-in GeoJSON
        console.log("Using built-in minimal GeoJSON data");
        
        // This is a simplified GeoJSON with the most important countries
        const minimalGeoJSON = {
          type: "FeatureCollection",
          features: [
            // United States
            {
              type: "Feature",
              properties: {
                NAME: "United States of America",
                ISO_A2: "US",
                ISO_A3: "USA"
              },
              geometry: {
                type: "MultiPolygon",
                coordinates: [[[[-125, 48], [-125, 32], [-110, 32], [-110, 48], [-125, 48]]]]
              },
              id: "USA"
            },
            // Brazil
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
            // Add more major countries
            {
              type: "Feature",
              properties: {
                NAME: "China",
                ISO_A2: "CN",
                ISO_A3: "CHN"
              },
              geometry: {
                type: "Polygon",
                coordinates: [[[75, 45], [75, 20], [135, 20], [135, 45], [75, 45]]]
              },
              id: "CHN"
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
                NAME: "Russia",
                ISO_A2: "RU",
                ISO_A3: "RUS"
              },
              geometry: {
                type: "Polygon",
                coordinates: [[[30, 70], [30, 50], [180, 50], [180, 70], [30, 70]]]
              },
              id: "RUS"
            },
            {
              type: "Feature",
              properties: {
                NAME: "Canada",
                ISO_A2: "CA",
                ISO_A3: "CAN"
              },
              geometry: {
                type: "Polygon",
                coordinates: [[[-140, 70], [-140, 50], [-50, 50], [-50, 70], [-140, 70]]]
              },
              id: "CAN"
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
                coordinates: [[[110, -10], [110, -40], [155, -40], [155, -10], [110, -10]]]
              },
              id: "AUS"
            },
            {
              type: "Feature",
              properties: {
                NAME: "United Kingdom",
                ISO_A2: "GB",
                ISO_A3: "GBR"
              },
              geometry: {
                type: "Polygon", 
                coordinates: [[[-6, 58], [-6, 50], [2, 50], [2, 58], [-6, 58]]]
              },
              id: "GBR"
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
                coordinates: [[[-5, 51], [-5, 42], [8, 42], [8, 51], [-5, 51]]]
              },
              id: "FRA"
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
                coordinates: [[[6, 55], [6, 47], [15, 47], [15, 55], [6, 55]]]
              },
              id: "DEU"
            }
          ]
        };
        
        cachedGeoJSON = minimalGeoJSON;
        return minimalGeoJSON;
      }
    }
  }
};

/**
 * Clear the cached GeoJSON data
 */
export const clearGeoJSONCache = (): void => {
  cachedGeoJSON = null;
};
