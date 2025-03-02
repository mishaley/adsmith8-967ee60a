
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
        
        const { data, error: invokeError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (invokeError) {
          console.error('Error invoking edge function:', invokeError);
          setError(`Failed to load map configuration: ${invokeError.message}`);
          return;
        }
        
        console.log("Response from Edge Function:", data);
        
        if (data && data.mapboxToken) {
          console.log("Successfully received Mapbox token");
          setMapboxToken(data.mapboxToken);
        } else if (data && data.error) {
          console.error('Error from Edge Function:', data.error);
          setError(`Error from server: ${data.error}`);
        } else {
          console.error('No mapbox token returned from Edge Function');
          setError('No mapbox token found');
        }
      } catch (err) {
        console.error('Exception fetching Mapbox token:', err);
        setError(`Failed to load map configuration: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMapboxToken();
  }, []);

  return { loading, mapboxToken, error };
};
