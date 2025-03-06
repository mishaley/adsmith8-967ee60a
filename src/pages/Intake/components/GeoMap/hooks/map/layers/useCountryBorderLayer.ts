
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
          '#999'  // Medium gray for non-selected country borders
        ],
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          2,
          ['boolean', ['feature-state', 'hover'], false],
          1.5,
          0.5
        ]
      }
    });
  } else {
    console.log("Countries border layer already exists");
  }
};
