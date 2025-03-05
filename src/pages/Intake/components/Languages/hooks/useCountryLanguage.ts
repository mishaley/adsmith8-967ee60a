
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCountryLanguage = (countryCode: string) => {
  const [primaryLanguageId, setPrimaryLanguageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryLanguage = async () => {
      if (!countryCode) {
        setPrimaryLanguageId(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Query the countries table to find the matching country and its primary language
        const { data, error } = await supabase
          .from("y3countries")
          .select("country_languageprimary")
          .eq("country_id", countryCode)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setPrimaryLanguageId(data.country_languageprimary);
        } else {
          setPrimaryLanguageId(null);
          console.log("No country found with ID:", countryCode);
        }
      } catch (err) {
        console.error("Error fetching country language:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch country language");
        setPrimaryLanguageId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryLanguage();
  }, [countryCode]);

  return { primaryLanguageId, isLoading, error };
};
