
import mapboxgl from 'mapbox-gl';

export const addCountrySource = (map: mapboxgl.Map) => {
  if (!map.getSource('countries')) {
    console.log("Adding countries source to map...");
    map.addSource('countries', {
      type: 'vector',
      url: 'mapbox://mapbox.country-boundaries-v1'
    });
  } else {
    console.log("Countries source already exists");
  }
};
