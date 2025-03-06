
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseDirectMapInteractionsProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  onCountrySelected: (countryId: string) => void;
  clearCountrySelection: () => void;
  selectedCountryId: string | null;
  setSelectedCountryId: (id: string | null) => void;
}

export const useDirectMapInteractions = ({
  map,
  onCountrySelected,
  clearCountrySelection,
  selectedCountryId,
  setSelectedCountryId
}: UseDirectMapInteractionsProps) => {
  
  // Setup hover and click interactions
  const setupInteractions = useCallback(() => {
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
  }, [map, onCountrySelected, clearCountrySelection, selectedCountryId, setSelectedCountryId]);

  return { setupInteractions };
};
