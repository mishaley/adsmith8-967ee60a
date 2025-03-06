
import { supabase } from "@/integrations/supabase/client";
import mapboxgl from 'mapbox-gl';

/**
 * Finds country_id from ISO code using Supabase query
 * @param isoCode The ISO 2 or ISO 3 code of the country
 * @returns The country_id if found, null otherwise
 */
export const getCountryIdFromIsoCode = async (isoCode: string): Promise<string | null> => {
  if (!isoCode) return null;
  
  try {
    console.log(`Looking up country_id for ISO code: ${isoCode}`);
    const { data, error } = await supabase
      .from('y3countries')
      .select('country_id')
      .or(`country_iso2.eq.${isoCode},country_iso3.eq.${isoCode}`)
      .maybeSingle();
      
    if (error) {
      console.error("Error finding country ID from ISO code:", error);
      return null;
    }
    
    if (data?.country_id) {
      console.log(`Found country_id: ${data.country_id} for ISO code: ${isoCode}`);
      return data.country_id;
    }
    
    console.log(`No country_id found for ISO code: ${isoCode}`);
    return null;
  } catch (error) {
    console.error("Exception finding country ID from ISO code:", error);
    return null;
  }
};

/**
 * Extracts country ID from a GeoJSON feature
 * @param feature The GeoJSON feature from mapbox
 * @returns Country ID string or null if not found
 */
export const getCountryIdFromFeature = (feature: mapboxgl.MapboxGeoJSONFeature): string | null => {
  if (!feature || !feature.properties) {
    return null;
  }
  
  // Try to find country code in standard properties
  // First try to get the ISO code from the feature
  const isoCode = feature.properties.iso_3166_1 || 
                 feature.properties.ISO_A2 || 
                 feature.properties.ISO_A3 ||
                 feature.properties.adm0_a3;
  
  if (isoCode) {
    console.log(`Found ISO code in feature: ${isoCode}`);
  } else {
    console.log("No ISO code found in feature properties:", feature.properties);
  }
  
  return isoCode || null;
};

/**
 * Converts a country_id to ISO code if needed
 * @param countryCode Country ID or ISO code
 * @returns ISO code either directly or converted from country_id
 */
export const convertToIsoCode = async (countryCode: string): Promise<string> => {
  // Check if this is a UUID (typical format for country_id)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(countryCode);
  
  // If not a UUID, assume it's already an ISO code
  if (!isUuid) {
    console.log(`Using ${countryCode} directly as ISO code (not a UUID)`);
    return countryCode;
  }
  
  // Convert UUID to ISO code
  try {
    console.log(`Converting country_id ${countryCode} to ISO code`);
    const { data, error } = await supabase
      .from('y3countries')
      .select('country_iso2')
      .eq('country_id', countryCode)
      .maybeSingle();
      
    if (error) {
      console.error("Error finding ISO code:", error);
      return countryCode; // Fall back to original code
    } 
    
    if (data?.country_iso2) {
      console.log(`Converted country_id ${countryCode} to ISO code ${data.country_iso2}`);
      return data.country_iso2;
    }
    
    console.log(`No ISO code found for country_id ${countryCode}, using as-is`);
    return countryCode; // Fall back to original code
  } catch (error) {
    console.error("Exception finding ISO code:", error);
    return countryCode; // Fall back to original code
  }
};

/**
 * Converts an ISO code to country_id
 * This is crucial for syncing map selections with the UI components
 */
export const convertIsoToCountryId = async (isoCode: string): Promise<string | null> => {
  if (!isoCode) return null;
  
  try {
    console.log(`Converting ISO code ${isoCode} to country_id`);
    const { data, error } = await supabase
      .from('y3countries')
      .select('country_id')
      .or(`country_iso2.eq.${isoCode},country_iso3.eq.${isoCode}`)
      .maybeSingle();
      
    if (error) {
      console.error("Error converting ISO to country_id:", error);
      return null;
    }
    
    if (data?.country_id) {
      console.log(`Converted ISO ${isoCode} to country_id: ${data.country_id}`);
      return data.country_id;
    }
    
    console.log(`No country_id found for ISO ${isoCode}`);
    return null;
  } catch (error) {
    console.error("Exception converting ISO to country_id:", error);
    return null;
  }
};
