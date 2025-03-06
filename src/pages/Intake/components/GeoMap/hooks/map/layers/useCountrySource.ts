
import mapboxgl from 'mapbox-gl';

export const addCountrySource = (map: mapboxgl.Map) => {
  if (!map.getSource('countries')) {
    console.log("Adding countries source to map...");
    try {
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });
      console.log("Countries source added successfully");
    } catch (error) {
      console.error("Error adding countries source:", error);
    }
  } else {
    console.log("Countries source already exists");
  }
};
