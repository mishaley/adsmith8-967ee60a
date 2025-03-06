
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCountriesGeoJSON } from './data/countriesGeoJSON';
import { toast } from "sonner";

interface UseDirectGeoJSONLayersProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  onCountrySelected: (countryId: string) => void;
}

export const useDirectGeoJSONLayers = ({ 
  map, 
  onCountrySelected 
}: UseDirectGeoJSONLayersProps) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  // Add GeoJSON source and layers to the map
  useEffect(() => {
    let isMounted = true;
    
    const initializeLayers = async () => {
      if (!map.current || initialized) return;
      
      try {
        console.log("Adding direct GeoJSON layers to map");
        
        // Wait for the map style to be loaded
        if (!map.current.isStyleLoaded()) {
          console.log("Map style not loaded yet, waiting...");
          map.current.once('style.load', () => {
            // Style loaded, try again
            initializeLayers();
          });
          return;
        }
        
        // Get the GeoJSON data
        const geojsonData = await getCountriesGeoJSON();
        
        if (!isMounted || !map.current) {
          console.log("Component unmounted or map removed during GeoJSON fetch");
          return;
        }
        
        // Add the GeoJSON source with the direct data
        console.log("Adding countries GeoJSON source");
        
        // Check if source already exists
        if (!map.current.getSource('countries-geojson')) {
          map.current.addSource('countries-geojson', {
            type: 'geojson',
            data: geojsonData,
            generateId: true  // Auto-generate feature IDs for state
          });
        }
        
        // Add a fill layer
        if (!map.current.getLayer('countries-fill')) {
          console.log("Adding countries fill layer");
          map.current.addLayer({
            id: 'countries-fill',
            type: 'fill',
            source: 'countries-geojson',
            paint: {
              'fill-color': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                '#154851',  // Selected country color
                ['boolean', ['feature-state', 'hover'], false],
                '#8ebdc2',  // Hover color
                'rgba(200, 200, 200, 0.03)'  // Default fill is very light
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                0.8,  // Higher opacity for selected country
                ['boolean', ['feature-state', 'hover'], false],
                0.6,  // Medium opacity for hover
                0.4   // Low opacity for default state
              ]
            }
          });
        }
        
        // Add a line layer for borders
        if (!map.current.getLayer('countries-line')) {
          console.log("Adding countries line layer");
          map.current.addLayer({
            id: 'countries-line',
            type: 'line',
            source: 'countries-geojson',
            paint: {
              'line-color': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                '#154851',  // Selected country border color
                ['boolean', ['feature-state', 'hover'], false],
                '#8ebdc2',  // Hover color
                '#c8c8c9'   // Default border color
              ],
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'selected'], false],
                2,  // Selected border width
                ['boolean', ['feature-state', 'hover'], false],
                1.5,  // Hover border width
                0.8   // Default border width
              ]
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            }
          });
        }
        
        // Setup click event for country selection
        setupInteractions();
        
        if (isMounted) {
          setInitialized(true);
          console.log("GeoJSON layers successfully initialized");
          
          // Notify user
          toast.success("Map loaded successfully", {
            duration: 2000,
          });
        }
      } catch (err) {
        console.error("Error initializing GeoJSON layers:", err);
        if (isMounted) {
          setError(`Failed to initialize map: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    };
    
    // Setup hover and click interactions
    const setupInteractions = () => {
      if (!map.current) return;
      
      let hoveredFeatureId: number | null = null;
      
      // Handle mouse enter - highlight country
      map.current.on('mousemove', 'countries-fill', (e) => {
        if (e.features && e.features.length > 0) {
          map.current!.getCanvas().style.cursor = 'pointer';
          
          const featureId = e.features[0].id as number;
          
          // Remove hover state from previous feature
          if (hoveredFeatureId !== null && hoveredFeatureId !== featureId) {
            map.current!.setFeatureState(
              { source: 'countries-geojson', id: hoveredFeatureId },
              { hover: false }
            );
          }
          
          // Add hover state to current feature
          if (hoveredFeatureId !== featureId) {
            hoveredFeatureId = featureId;
            map.current!.setFeatureState(
              { source: 'countries-geojson', id: featureId },
              { hover: true }
            );
          }
        }
      });
      
      // Handle mouse leave - remove highlight
      map.current.on('mouseleave', 'countries-fill', () => {
        map.current!.getCanvas().style.cursor = '';
        
        if (hoveredFeatureId !== null) {
          map.current!.setFeatureState(
            { source: 'countries-geojson', id: hoveredFeatureId },
            { hover: false }
          );
          hoveredFeatureId = null;
        }
      });
      
      // Handle click - select or deselect country
      map.current.on('click', 'countries-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const featureId = feature.id as number;
          const properties = feature.properties;
          
          // Get ISO code from properties
          const isoCode = properties.ISO_A3 || properties.ISO_A2 || properties.iso_a3 || properties.iso_a2;
          
          console.log(`Country clicked: ${properties.NAME}, ISO: ${isoCode}, ID: ${featureId}`);
          
          // If clicking the already selected country, deselect it
          if (isoCode === selectedCountryId) {
            console.log(`Deselecting country: ${properties.NAME}`);
            clearCountrySelection();
            
            // Notify parent about deselection with empty string
            onCountrySelected('');
            return;
          }
          
          // Clear previous selection first
          clearCountrySelection();
          
          // Set the new selection
          if (isoCode) {
            setSelectedCountryId(isoCode);
            
            // Set feature state to selected
            map.current!.setFeatureState(
              { source: 'countries-geojson', id: featureId },
              { selected: true }
            );
            
            // Call the callback with the country code
            onCountrySelected(isoCode);
          }
        }
      });
      
      // Double-click to zoom to country
      map.current.on('dblclick', 'countries-fill', (e) => {
        if (e.features && e.features.length > 0) {
          e.preventDefault(); // Prevent default zoom
          
          const feature = e.features[0];
          
          try {
            // Get feature bounds
            const bounds = new mapboxgl.LngLatBounds();
            
            if (feature.geometry.type === 'Polygon') {
              feature.geometry.coordinates.forEach((ring) => {
                ring.forEach((coord) => {
                  bounds.extend(coord as [number, number]);
                });
              });
            } else if (feature.geometry.type === 'MultiPolygon') {
              feature.geometry.coordinates.forEach((polygon) => {
                polygon.forEach((ring) => {
                  ring.forEach((coord) => {
                    bounds.extend(coord as [number, number]);
                  });
                });
              });
            }
            
            // Zoom to bounds with padding
            map.current!.fitBounds(bounds, {
              padding: 40,
              maxZoom: 6
            });
          } catch (error) {
            console.error("Error zooming to country:", error);
          }
        }
      });
    };
    
    initializeLayers();
    
    return () => {
      isMounted = false;
    };
  }, [map, initialized, onCountrySelected]);
  
  // Function to highlight a country programmatically
  const highlightCountry = (countryId: string) => {
    if (!map.current || !initialized || !countryId) {
      console.log(`Cannot highlight country ${countryId} - map not ready or country ID empty`);
      return;
    }
    
    console.log(`Programmatically highlighting country: ${countryId}`);
    
    // Clear any existing selection
    clearCountrySelection();
    
    if (!countryId) return;
    
    try {
      // Find the feature by ISO code
      const features = map.current.querySourceFeatures('countries-geojson', {
        filter: [
          'any',
          ['==', ['get', 'ISO_A2'], countryId],
          ['==', ['get', 'ISO_A3'], countryId],
          ['==', ['get', 'iso_a2'], countryId],
          ['==', ['get', 'iso_a3'], countryId]
        ]
      });
      
      if (features.length > 0) {
        const feature = features[0];
        const featureId = feature.id as number;
        
        console.log(`Found feature with ID ${featureId} for country ${countryId}`);
        
        // Set feature state to selected
        map.current.setFeatureState(
          { source: 'countries-geojson', id: featureId },
          { selected: true }
        );
        
        setSelectedCountryId(countryId);
      } else {
        console.log(`No features found for country code: ${countryId}`);
        
        // Retry with a more expensive search as fallback
        setTimeout(() => {
          retryHighlightWithFullScan(countryId);
        }, 500);
      }
    } catch (error) {
      console.error(`Error highlighting country ${countryId}:`, error);
    }
  };
  
  // Function to retry highlight with a full scan of features
  const retryHighlightWithFullScan = (countryId: string) => {
    if (!map.current || !initialized) return;
    
    console.log(`Retrying highlight with full scan for: ${countryId}`);
    
    try {
      // Get all features from the source
      const allFeatures = map.current.querySourceFeatures('countries-geojson');
      
      // Manually search through all feature properties
      const matchingFeature = allFeatures.find(feature => {
        const props = feature.properties;
        return (
          props.ISO_A2 === countryId ||
          props.ISO_A3 === countryId ||
          props.iso_a2 === countryId ||
          props.iso_a3 === countryId
        );
      });
      
      if (matchingFeature) {
        const featureId = matchingFeature.id as number;
        
        console.log(`Full scan found feature with ID ${featureId} for country ${countryId}`);
        
        // Set feature state to selected
        map.current.setFeatureState(
          { source: 'countries-geojson', id: featureId },
          { selected: true }
        );
        
        setSelectedCountryId(countryId);
      } else {
        console.log(`Full scan found no features for country code: ${countryId}`);
      }
    } catch (error) {
      console.error(`Error in full scan for country ${countryId}:`, error);
    }
  };
  
  // Function to clear current country selection
  const clearCountrySelection = () => {
    if (!map.current || !initialized) return;
    
    if (selectedCountryId) {
      console.log(`Clearing selection for country: ${selectedCountryId}`);
      
      // Find all features that might be selected
      const features = map.current.querySourceFeatures('countries-geojson');
      
      // Clear selection state from all features
      features.forEach(feature => {
        if (feature.id !== undefined) {
          map.current!.setFeatureState(
            { source: 'countries-geojson', id: feature.id },
            { selected: false }
          );
        }
      });
      
      setSelectedCountryId(null);
    }
  };
  
  return {
    initialized,
    error,
    highlightCountry,
    clearCountrySelection,
    selectedCountryId
  };
};
