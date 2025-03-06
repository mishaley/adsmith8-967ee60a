
import mapboxgl from 'mapbox-gl';

export const addCountryFillLayer = (map: mapboxgl.Map) => {
  if (!map.getLayer('countries-fill')) {
    console.log("Adding countries fill layer...");
    map.addLayer({
      id: 'countries-fill',
      type: 'fill',
      source: 'countries',
      'source-layer': 'country_boundaries',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#154851',
          ['boolean', ['feature-state', 'hover'], false],
          '#8ebdc2',
          'rgba(200, 200, 200, 0.1)'  // Very light fill for non-selected countries
        ],
        'fill-opacity': 0.6  // Reduced from 0.7 to make borders more visible
      }
    });
  } else {
    console.log("Countries fill layer already exists");
  }
};
