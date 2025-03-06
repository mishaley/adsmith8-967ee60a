
import mapboxgl from 'mapbox-gl';

export const addCountryFillLayer = (map: mapboxgl.Map) => {
  if (!map.getLayer('countries-fill')) {
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
          'transparent'
        ],
        'fill-opacity': 0.7
      }
    });
  }
};
