
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
          'rgba(200, 200, 200, 0.05)'  // Even lighter fill to make borders more visible
        ],
        'fill-opacity': 0.5  // Reduced opacity to make borders stand out more
      }
    });
  } else {
    console.log("Countries fill layer already exists");
  }
};
