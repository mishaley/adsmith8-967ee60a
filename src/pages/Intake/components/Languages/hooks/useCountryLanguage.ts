
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to fetch the primary language for a selected country
 * @param countryCode The ID of the selected country
 * @returns Object containing the primary language ID, loading state, and any errors
 */
export const useCountryLanguage = (countryCode: string) => {
  const [primaryLanguageId, setPrimaryLanguageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryLanguage = async () => {
      // Clear state if no country code is provided
      if (!countryCode) {
        setPrimaryLanguageId(null);
        setCountryName(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Query the countries table to find the matching country and its primary language
        const { data, error } = await supabase
          .from("y3countries")
          .select("country_name, country_languageprimary")
          .eq("country_id", countryCode)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPrimaryLanguageId(data.country_languageprimary);
          setCountryName(data.country_name);
          console.log(`Found country: ${data.country_name} with primary language ID: ${data.country_languageprimary}`);
        } else {
          setPrimaryLanguageId(null);
          setCountryName(null);
          console.log("No country found with ID:", countryCode);
        }
      } catch (err) {
        console.error("Error fetching country language:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch country language");
        setPrimaryLanguageId(null);
        setCountryName(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryLanguage();
  }, [countryCode]);

  return { primaryLanguageId, countryName, isLoading, error };
};
