
import mapboxgl from 'mapbox-gl';

export const addCoastlineLayer = (map: mapboxgl.Map) => {
  if (!map.getLayer('coastline-layer')) {
    console.log("Adding coastline layer...");
    
    // First check if composite source exists
    if (map.getSource('composite')) {
      map.addLayer({
        id: 'coastline-layer',
        type: 'line',
        source: 'composite',
        'source-layer': 'water',
        paint: {
          'line-color': '#8ebdc2',  // Blue-green color for coastlines
          'line-width': 1.0,        // Slightly thicker for visibility
          'line-opacity': 0.9       // Higher opacity for better visibility
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'   // Ensure layer is visible
        }
      });
      console.log("Added coastline layer using composite water source");
    } else {
      console.log("Composite source not found, trying alternative approach");
      
      // Try to add a waterway layer as a fallback
      try {
        map.addLayer({
          id: 'coastline-layer',
          type: 'line',
          source: 'mapbox',
          'source-layer': 'waterway',
          paint: {
            'line-color': '#8ebdc2',
            'line-width': 1.0,
            'line-opacity': 0.9
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
          }
        });
        console.log("Added coastline layer using waterway source");
      } catch (error) {
        console.error("Failed to add coastline layer:", error);
      }
    }
  } else {
    console.log("Coastline layer already exists");
  }
};
