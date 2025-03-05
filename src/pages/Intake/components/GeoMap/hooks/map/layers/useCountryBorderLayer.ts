
import mapboxgl from 'mapbox-gl';

export const useCountryBorderLayer = (map: mapboxgl.Map) => {
  const addCountryBorderLayer = () => {
    if (!map.getLayer('countries-border')) {
      map.addLayer({
        id: 'countries-border',
        type: 'line',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': '#0c343d', // Border color
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            2,
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.5
          ],
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            1,
            ['boolean', ['feature-state', 'hover'], false],
            0.8,
            0.5
          ]
        }
      });
    }
  };

  return { addCountryBorderLayer };
};
