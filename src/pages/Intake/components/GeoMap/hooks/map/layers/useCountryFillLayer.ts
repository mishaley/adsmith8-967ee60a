
import mapboxgl from 'mapbox-gl';

export const useCountryFillLayer = (map: mapboxgl.Map) => {
  const addCountryFillLayer = () => {
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
            '#0c343d', // Selected color 
            ['boolean', ['feature-state', 'hover'], false],
            '#76adb3', // Hover color
            'transparent' // Default color - transparent
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            0.5, // Selected opacity
            ['boolean', ['feature-state', 'hover'], false],
            0.4, // Hover opacity
            0 // Default opacity - transparent
          ]
        }
      });
    }
  };

  return { addCountryFillLayer };
};
