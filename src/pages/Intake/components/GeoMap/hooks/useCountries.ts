
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Country {
  country_id: string;
  country_name: string;
  country_flag: string;
  country_languageprimary: string;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('y3countries')
          .select('country_id, country_name, country_flag, country_languageprimary')
          .order('country_name');

        if (error) {
          throw error;
        }

        setCountries(data || []);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError(err instanceof Error ? err.message : 'Failed to load countries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, isLoading, error };
};
