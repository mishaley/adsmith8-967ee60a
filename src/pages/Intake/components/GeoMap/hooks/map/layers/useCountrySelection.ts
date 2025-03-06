
import mapboxgl from 'mapbox-gl';
import { calculateFeatureBbox } from './utils/bboxUtils';

let selectedCountryId: string | null = null;

export const setupClickEvents = (map: mapboxgl.Map, onCountryClick: (countryId: string) => void) => {
  // On click
  map.on('click', 'countries-fill', (e) => {
    if (e.features && e.features.length > 0) {
      const countryId = e.features[0].id as string;
      const countryName = e.features[0].properties?.iso_3166_1 || '';
      
      onCountryClick(countryName);
    }
  });
};

export const highlightCountry = (map: mapboxgl.Map, countryId: string) => {
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
  
  console.log(`Attempting to highlight country with ID: ${countryId}`);
  
  // Find feature ID for the country code
  const features = map.querySourceFeatures('countries', {
    sourceLayer: 'country_boundaries',
    filter: ['==', 'iso_3166_1', countryId]
  });
  
  console.log(`Found ${features.length} features for country ${countryId}`);
  
  if (features.length > 0) {
    for (const feature of features) {
      if (feature.id) {
        selectedCountryId = feature.id as string;
        
        console.log(`Setting feature state for ID: ${selectedCountryId}`);
        
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
          { selected: true }
        );
        
        // Ensure the country is visible by fitting the map to the country's bounds
        const bbox = calculateFeatureBbox(feature);
        
        if (!bbox.isEmpty()) {
          map.fitBounds(bbox, {
            padding: 50,
            maxZoom: 5
          });
        }
        
        // Once we've found and highlighted a feature, we can break
        break;
      }
    }
  } else {
    console.log(`No features found for country ${countryId}. Waiting for map to fully load...`);
    
    // If no features found, it might be because the map is still loading
    // Set a timeout to try again after a short delay
    setTimeout(() => {
      const delayedFeatures = map.querySourceFeatures('countries', {
        sourceLayer: 'country_boundaries',
        filter: ['==', 'iso_3166_1', countryId]
      });
      
      console.log(`After delay: Found ${delayedFeatures.length} features for country ${countryId}`);
      
      if (delayedFeatures.length > 0 && delayedFeatures[0].id) {
        selectedCountryId = delayedFeatures[0].id as string;
        
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: selectedCountryId },
          { selected: true }
        );
        
        const bbox = calculateFeatureBbox(delayedFeatures[0]);
        
        if (!bbox.isEmpty()) {
          map.fitBounds(bbox, {
            padding: 50,
            maxZoom: 5
          });
        }
      }
    }, 500);
  }
};
