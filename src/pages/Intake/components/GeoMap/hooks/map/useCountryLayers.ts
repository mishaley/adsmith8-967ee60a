
import { useEffect } from "react";
import mapboxgl from 'mapbox-gl';

interface UseCountryLayersProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialized: boolean;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  setMapError: (error: string | null) => void;
}

export const useCountryLayers = ({
  map,
  initialized,
  selectedCountry,
  setSelectedCountry,
  setMapError
}: UseCountryLayersProps) => {
  
  useEffect(() => {
    if (!map.current || !initialized) return;
    
    try {
      let hoveredPolygonId: string | number | null = null;
      
      // Add country boundaries source and layer
      map.current.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });
      
      // Add fill layer for countries
      map.current.addLayer({
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
      
      // Add border layer for countries
      map.current.addLayer({
        id: 'countries-borders',
        type: 'line',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': '#666666',
          'line-width': 0.5
        }
      });
      
      // Setup event handlers for hover states
      setupHoverHandlers(map.current, hoveredPolygonId);
      
      // Handle country selection on click
      setupClickHandler(map.current, setSelectedCountry);
      
      // Make sure we fit to bounds with more padding to show the entire world
      fitMapToBounds(map.current);
      
    } catch (layerErr) {
      console.error("Error setting up map layers:", layerErr);
      setMapError(`Error setting up map layers: ${layerErr instanceof Error ? layerErr.message : String(layerErr)}`);
    }
  }, [initialized, selectedCountry, setSelectedCountry, setMapError, map]);

  // Update the fill color based on selection when selectedCountry changes
  useEffect(() => {
    if (!map.current || !initialized) return;
    
    map.current.setPaintProperty('countries-fills', 'fill-color', [
      'case',
      ['==', ['get', 'name_en'], selectedCountry],
      '#154851', // Selected country color
      '#EAEAEA'  // Default color
    ]);
  }, [selectedCountry, initialized, map]);
};

// Helper function to set up hover handlers
function setupHoverHandlers(map: mapboxgl.Map, hoveredPolygonId: string | number | null) {
  // Handle hover states
  map.on('mousemove', 'countries-fills', (e) => {
    if (!map || !e.features || e.features.length === 0) return;
    
    if (hoveredPolygonId !== null) {
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
        { hover: false }
      );
    }
    
    hoveredPolygonId = e.features[0].id;
    
    map.setFeatureState(
      { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
      { hover: true }
    );
    
    // Change cursor to pointer on hover
    const canvas = map.getCanvas();
    if (canvas) {
      canvas.style.cursor = 'pointer';
    }
  });
  
  // Handle mouse leave
  map.on('mouseleave', 'countries-fills', () => {
    if (!map) return;
    
    if (hoveredPolygonId !== null) {
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredPolygonId },
        { hover: false }
      );
    }
    hoveredPolygonId = null;
    
    // Reset cursor
    const canvas = map.getCanvas();
    if (canvas) {
      canvas.style.cursor = '';
    }
  });
}

// Helper function to set up click handler
function setupClickHandler(map: mapboxgl.Map, setSelectedCountry: (country: string) => void) {
  map.on('click', 'countries-fills', (e) => {
    if (!map || !e.features || e.features.length === 0) return;
    
    const countryName = e.features[0].properties?.name_en;
    if (countryName) {
      setSelectedCountry(countryName);
    }
  });
}

// Helper function to fit map to bounds
function fitMapToBounds(map: mapboxgl.Map) {
  map.fitBounds([
    [-170, -65], // Southwest coordinates (expanded)
    [170, 75]    // Northeast coordinates (expanded)
  ], {
    padding: { top: 40, bottom: 40, left: 40, right: 40 },
    animate: false
  });
}
