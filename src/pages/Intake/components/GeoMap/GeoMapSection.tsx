
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Map } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

interface GeoMapSectionProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const GeoMapSection: React.FC<GeoMapSectionProps> = ({
  selectedCountry,
  setSelectedCountry
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch Mapbox token from Edge Function Secrets
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

  // Initialize map once token is available
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 1.2,
        center: [0, 20],
        projection: 'mercator'
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      let hoveredPolygonId: string | number | null = null;
      
      map.current.on('load', () => {
        // Add country boundaries source and layer
        map.current?.addSource('countries', {
          type: 'vector',
          url: 'mapbox://mapbox.country-boundaries-v1'
        });
        
        map.current?.addLayer({
          id: 'countries-fills',
          type: 'fill',
          source: 'countries',
          'source-layer': 'country_boundaries',
          paint: {
            'fill-color': [
              'case',
              ['==', ['get', 'name_en'], selectedCountry],
              '#154851', // Selected country color (matches app theme)
              '#EAEAEA'  // Default color
            ],
            'fill-opacity': [
              'case',
              ['==', ['get', 'name_en'], selectedCountry],
              0.8,
              ['boolean', ['feature-state', 'hover'], false],
              0.5,
              0.2
            ]
          }
        });
        
        map.current?.addLayer({
          id: 'countries-borders',
          type: 'line',
          source: 'countries',
          'source-layer': 'country_boundaries',
          paint: {
            'line-color': '#666666',
            'line-width': 0.5
          }
        });
        
        // Handle hover states
        map.current?.on('mousemove', 'countries-fills', (e) => {
          if (e.features && e.features.length > 0) {
            if (hoveredPolygonId !== null) {
              map.current?.setFeatureState(
                { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
                { hover: false }
              );
            }
            
            hoveredPolygonId = e.features[0].id;
            
            map.current?.setFeatureState(
              { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
              { hover: true }
            );
            
            // Change cursor to pointer on hover
            map.current?.getCanvas().style.cursor = 'pointer';
          }
        });
        
        // Handle mouse leave
        map.current?.on('mouseleave', 'countries-fills', () => {
          if (hoveredPolygonId !== null) {
            map.current?.setFeatureState(
              { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
              { hover: false }
            );
          }
          hoveredPolygonId = null;
          
          // Reset cursor
          map.current?.getCanvas().style.cursor = '';
        });
        
        // Handle country selection on click
        map.current?.on('click', 'countries-fills', (e) => {
          if (e.features && e.features.length > 0) {
            const countryName = e.features[0].properties?.name_en;
            if (countryName) {
              setSelectedCountry(countryName);
              
              // Update the fill color based on selection
              map.current?.setPaintProperty('countries-fills', 'fill-color', [
                'case',
                ['==', ['get', 'name_en'], countryName],
                '#154851', // Selected country color
                '#EAEAEA'  // Default color
              ]);
            }
          }
        });
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, selectedCountry, setSelectedCountry]);

  return (
    <>
      <tr className="border-b">
        <td colSpan={2} className="py-4 text-lg">
          <div className="w-full text-left pl-4 flex items-center">
            <span>Geo Bounds</span>
            {selectedCountry && (
              <div className="ml-4 px-3 py-1 rounded bg-[#154851] text-white text-sm">
                {selectedCountry}
              </div>
            )}
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="p-0">
          <div className="w-full p-4">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded">
                <Loader className="h-8 w-8 animate-spin" />
                <div className="ml-2">Loading map...</div>
              </div>
            ) : error ? (
              <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded text-red-500">
                <div>{error}</div>
              </div>
            ) : (
              <div className="h-[300px] rounded overflow-hidden border border-gray-300 relative">
                <div ref={mapContainer} className="absolute inset-0" />
                {selectedCountry && (
                  <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedCountry('')}
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-500">
              Click on a country to select it as your geo boundary
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default GeoMapSection;
