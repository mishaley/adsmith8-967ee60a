
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
        ],
        'line-opacity': 1.0  // Increased opacity for better visibility
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      }
    });
    console.log("Countries border layer added");
  } else {
    console.log("Countries border layer already exists");
  }
};
