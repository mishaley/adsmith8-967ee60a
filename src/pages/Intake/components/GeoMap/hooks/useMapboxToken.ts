
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
        console.log("Fetching Mapbox token from Edge Function...");
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching mapbox token:', error);
          setError('Failed to load map configuration');
          return;
        }
        
        if (data && data.mapboxToken) {
          console.log("Successfully received Mapbox token");
          setMapboxToken(data.mapboxToken);
        } else {
          console.error('No mapbox token returned from Edge Function');
          setError('No mapbox token found');
        }
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        setError('Failed to load map configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  return { loading, mapboxToken, error };
};
