
import mapboxgl from 'mapbox-gl';

export const useCountrySource = (map: mapboxgl.Map) => {
  const addCountrySource = () => {
    if (!map.getSource('countries')) {
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });
    }
  };

  return { addCountrySource };
};
