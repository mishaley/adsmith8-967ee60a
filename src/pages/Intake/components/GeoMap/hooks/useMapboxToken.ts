
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useMapboxToken = () => {
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching mapbox token:', error);
          setError('Failed to load map configuration');
          return;
        }
        
        if (data && data.mapboxToken) {
          setMapboxToken(data.mapboxToken);
        } else {
          setError('No mapbox token found');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load map configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  return { loading, mapboxToken, error };
};
