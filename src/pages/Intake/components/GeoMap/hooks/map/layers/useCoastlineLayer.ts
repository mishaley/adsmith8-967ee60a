
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
          'line-color': '#c8c8c9',  // Match the default country border color
          'line-width': 0.8,        // Match the default border width
          'line-opacity': 1.0       // Full opacity like country borders
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
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
            'line-color': '#c8c8c9',  // Match country border color
            'line-width': 0.8,        // Match default country border width
            'line-opacity': 1.0       // Full opacity
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
