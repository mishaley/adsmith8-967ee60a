
import mapboxgl from 'mapbox-gl';

export const addCountrySource = (map: mapboxgl.Map) => {
  if (!map.getSource('countries')) {
    map.addSource('countries', {
      type: 'vector',
      url: 'mapbox://mapbox.country-boundaries-v1'
    });
  }
};
