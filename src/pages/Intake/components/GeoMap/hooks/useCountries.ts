
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Country {
  country_id: string;
  country_name: string;
  country_flag: string;
  country_iso2: string;
  country_iso3: string;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching countries from Supabase...");
        const { data, error } = await supabase
          .from("y3countries")
          .select("country_id, country_name, country_flag, country_languageprimary")
          .order("country_name");
          
        if (error) {
          throw error;
        }
        
        if (data) {
          console.log(`Fetched ${data.length} countries`);
          // Map the response to match our Country interface
          const formattedCountries: Country[] = data.map(country => ({
            country_id: country.country_id,
            country_name: country.country_name,
            country_flag: country.country_flag,
            country_iso2: country.country_id, // Use country_id as ISO2 since it's missing
            country_iso3: country.country_id  // Use country_id as ISO3 since it's missing
          }));
          setCountries(formattedCountries);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCountries();
  }, []);
  
  return { countries, isLoading, error };
};
