
import mapboxgl from 'mapbox-gl';

export const addCoastlineLayer = (map: mapboxgl.Map) => {
  if (!map.getLayer('coastline-layer')) {
    console.log("Adding coastline layer...");
    
    // First check if water source exists
    if (map.getSource('composite')) {
      map.addLayer({
        id: 'coastline-layer',
        type: 'line',
        source: 'composite',
        'source-layer': 'water',
        paint: {
          'line-color': '#8ebdc2',
          'line-width': 0.8,
          'line-opacity': 0.7
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        }
      });
      console.log("Added coastline layer using composite water source");
    } else {
      console.log("Composite source not found, skipping coastline layer");
    }
  } else {
    console.log("Coastline layer already exists");
  }
};
