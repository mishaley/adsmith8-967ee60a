
import { supabase } from "@/integrations/supabase/client";

/**
 * Finds country_id from ISO code using Supabase query
 * @param isoCode The ISO 2 or ISO 3 code of the country
 * @returns The country_id if found, null otherwise
 */
export const getCountryIdFromIsoCode = async (isoCode: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('y3countries')
      .select('country_id')
      .or(`country_iso2.eq.${isoCode},country_iso3.eq.${isoCode}`)
      .maybeSingle();
      
    if (error) {
      console.error("Error finding country ID from ISO code:", error);
      return null;
    }
    
    return data?.country_id || null;
  } catch (error) {
    console.error("Exception finding country ID from ISO code:", error);
    return null;
  }
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
    return countryCode;
  }
  
  // Convert UUID to ISO code
  try {
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
    
    return countryCode; // Fall back to original code
  } catch (error) {
    console.error("Exception finding ISO code:", error);
    return countryCode; // Fall back to original code
  }
};
