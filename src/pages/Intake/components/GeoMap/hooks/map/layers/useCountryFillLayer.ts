
import mapboxgl from 'mapbox-gl';

export const addCountryFillLayer = (map: mapboxgl.Map) => {
  if (!map.getLayer('country-fills')) {
    console.log("Adding countries fill layer...");
    map.addLayer({
      id: 'country-fills',
      type: 'fill',
      source: 'countries',
      'source-layer': 'country_boundaries',
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#154851',  // Selected country color - darker teal
          ['boolean', ['feature-state', 'hover'], false],
          '#8ebdc2',  // Hover color - lighter teal
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
  } else {
    console.log("Countries fill layer already exists");
  }
};
