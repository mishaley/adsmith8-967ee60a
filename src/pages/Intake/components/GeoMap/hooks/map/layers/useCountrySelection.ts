
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
      
      // Ensure the country is visible by fitting the map to the country's bounds
      const bbox = calculateFeatureBbox(feature);
      
      if (!bbox.isEmpty()) {
        map.fitBounds(bbox, {
          padding: 50,
          maxZoom: 5
        });
      }
    }
  });
};
