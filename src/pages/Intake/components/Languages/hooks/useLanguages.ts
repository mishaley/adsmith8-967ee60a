
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
  display: string;
}

export const useLanguages = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("y2languages")
          .select("language_id, language_name, language_native, language_flag")
          .order("language_name", { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform data to match the component's expected format
          const formattedLanguages = data.map(lang => ({
            code: lang.language_id,
            name: lang.language_name,
            native: lang.language_native,
            flag: lang.language_flag,
            display: `${lang.language_flag} ${lang.language_name} (${lang.language_native})`
          }));
          setLanguages(formattedLanguages);
        }
      } catch (err) {
        console.error("Error fetching languages:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch languages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, isLoading, error };
};
