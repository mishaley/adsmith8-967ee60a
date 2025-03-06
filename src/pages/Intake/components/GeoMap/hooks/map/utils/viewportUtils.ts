
import mapboxgl from 'mapbox-gl';

/**
 * Adjusts map view based on container width
 */
export function adjustMapView(map: mapboxgl.Map, width: number) {
  console.log("Adjusting map view for container width:", width);
  
  // Base zoom level scaled by container width
  let zoom = 1.0;
  if (width >= 400 && width < 600) {
    zoom = 1.2;
  } else if (width >= 600 && width < 800) {
    zoom = 1.4;
  } else if (width >= 800) {
    zoom = 1.5;
  }
  
  map.setZoom(zoom);
  
  // Ensure the map is set to a flat/mercator projection
  if (map.getProjection()?.name !== 'mercator') {
    try {
      map.setProjection('mercator');
      console.log("Set map projection to mercator (flat map)");
    } catch (error) {
      console.error("Error setting projection to mercator:", error);
    }
  }
  
  // Set padding for the world bounds
  const padding = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  };
  
  // Fit to show most of the world
  map.fitBounds([
    [-170, -50], // Southwest corner
    [170, 70]    // Northeast corner
  ], {
    padding,
    linear: true,
    duration: 0
  });
}
