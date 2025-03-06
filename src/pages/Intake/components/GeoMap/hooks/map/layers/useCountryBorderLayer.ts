
import mapboxgl from 'mapbox-gl';

export const addCountryBorderLayer = (map: mapboxgl.Map) => {
  if (!map.getLayer('countries-border')) {
    console.log("Adding countries border layer...");
    map.addLayer({
      id: 'countries-border',
      type: 'line',
      source: 'countries',
      'source-layer': 'country_boundaries',
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#154851',
          ['boolean', ['feature-state', 'hover'], false],
          '#8ebdc2',
          '#666666'  // Much darker border color for better visibility
        ],
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          3,  // Thicker for selected
          ['boolean', ['feature-state', 'hover'], false],
          2,  // Thicker for hover
          1   // Base thickness increased for better visibility
        ],
        'line-opacity': 1.0  // Full opacity for maximum visibility
      }
    });
  } else {
    console.log("Countries border layer already exists");
  }
};
