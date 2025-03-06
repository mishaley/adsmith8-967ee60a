
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
          '#154851',  // Keep selected color
          ['boolean', ['feature-state', 'hover'], false],
          '#8ebdc2',  // Keep hover color
          '#c8c8c9'   // Lighter, more subtle border color
        ],
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          2,  // Slightly thinner for selected
          ['boolean', ['feature-state', 'hover'], false],
          1.5,  // Thinner for hover
          0.8   // Much thinner base width for more elegance
        ],
        'line-opacity': 0.8  // Slightly reduced opacity for softer appearance
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      }
    });
  } else {
    console.log("Countries border layer already exists");
  }
};
