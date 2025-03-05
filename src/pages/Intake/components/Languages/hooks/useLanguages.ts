
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Language {
  language_id: string;
  language_name: string;
  language_native: string;
  language_flag: string;
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
          setLanguages(data as Language[]);
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
