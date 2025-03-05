
import mapboxgl from 'mapbox-gl';

interface UseCountryLayersProps {
  map: mapboxgl.Map;
  onCountryClick: (countryId: string) => void;
}

export const useCountryLayers = ({
  map,
  onCountryClick
}: UseCountryLayersProps) => {
  // Add country source
  const addCountrySource = () => {
    if (!map.getSource('countries')) {
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });
    }
  };

  // Add fill layer with hover and click effects
  const addCountryLayers = () => {
    // Default fill layer
    if (!map.getLayer('countries-fill')) {
      map.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#154851', // Selected color
            ['boolean', ['feature-state', 'hover'], false],
            '#76adb3', // Hover color
            'transparent' // Default color - transparent
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            0.5, // Selected opacity
            ['boolean', ['feature-state', 'hover'], false],
            0.4, // Hover opacity
            0 // Default opacity - transparent
          ]
        }
      });
    }

    // Border layer
    if (!map.getLayer('countries-border')) {
      map.addLayer({
        id: 'countries-border',
        type: 'line',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': '#154851',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            2,
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.5
          ],
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            1,
            ['boolean', ['feature-state', 'hover'], false],
            0.8,
            0.5
          ]
        }
      });
    }
  };

  // Set up hover state
  let hoveredCountryId: string | null = null;

  const setupHoverEvents = () => {
    // On mouse enter
    map.on('mousemove', 'countries-fill', (e) => {
      if (e.features && e.features.length > 0) {
        // Set the cursor to pointer when hovering over a country
        map.getCanvas().style.cursor = 'pointer';
        
        if (hoveredCountryId) {
          map.setFeatureState(
            { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredCountryId },
            { hover: false }
          );
        }
        
        hoveredCountryId = e.features[0].id as string;
        
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredCountryId },
          { hover: true }
        );
      }
    });

    // On mouse leave
    map.on('mouseleave', 'countries-fill', () => {
      map.getCanvas().style.cursor = '';
      
      if (hoveredCountryId) {
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredCountryId },
          { hover: false }
        );
      }
      
      hoveredCountryId = null;
    });

    // On click
    map.on('click', 'countries-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const countryId = e.features[0].id as string;
        const countryName = e.features[0].properties?.iso_3166_1 || '';
        
        onCountryClick(countryName);
      }
    });
  };

  // Selected country state
  let selectedCountryId: string | null = null;

  // Function to highlight a country by ID
  const highlightCountry = (countryId: string) => {
    if (!map || !map.isStyleLoaded()) {
      console.log("Map style not loaded yet, can't highlight country");
      return;
    }
    
    // Clear previous selection
    if (selectedCountryId) {
      map.setFeatureState(
        { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
        { selected: false }
      );
    }
    
    if (!countryId) {
      selectedCountryId = null;
      return;
    }
    
    // Find feature ID for the country code
    map.querySourceFeatures('countries', {
      sourceLayer: 'country_boundaries',
      filter: ['==', 'iso_3166_1', countryId]
    }).forEach(feature => {
      if (feature.id) {
        selectedCountryId = feature.id as string;
        
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
          { selected: true }
        );
        
        // Ensure the country is visible
        const bbox = new mapboxgl.LngLatBounds();
        if (feature.geometry.type === 'Polygon') {
          (feature.geometry.coordinates[0] as [number, number][]).forEach(coord => {
            bbox.extend(coord as mapboxgl.LngLatLike);
          });
        } else if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach(polygon => {
            (polygon[0] as [number, number][]).forEach(coord => {
              bbox.extend(coord as mapboxgl.LngLatLike);
            });
          });
        }
        
        if (!bbox.isEmpty()) {
          map.fitBounds(bbox, {
            padding: 50,
            maxZoom: 5
          });
        }
      }
    });
  };

  // Initialize everything
  addCountrySource();
  addCountryLayers();
  setupHoverEvents();

  // Return methods that can be used by the parent component
  return {
    highlightCountry
  };
};
