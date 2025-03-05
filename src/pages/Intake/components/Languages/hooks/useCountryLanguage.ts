
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCountryLanguage = (countryId: string) => {
  const [primaryLanguageId, setPrimaryLanguageId] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryId) {
      setPrimaryLanguageId(null);
      setCountryName(null);
      return;
    }

    const fetchCountryLanguage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('y3countries')
          .select('country_name, country_languageprimary')
          .eq('country_id', countryId)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          setPrimaryLanguageId(data.country_languageprimary);
          setCountryName(data.country_name);
        } else {
          setPrimaryLanguageId(null);
          setCountryName(null);
        }
      } catch (err) {
        console.error('Error fetching country language:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch country language');
        setPrimaryLanguageId(null);
        setCountryName(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryLanguage();
  }, [countryId]);

  return { primaryLanguageId, countryName, isLoading, error };
};
