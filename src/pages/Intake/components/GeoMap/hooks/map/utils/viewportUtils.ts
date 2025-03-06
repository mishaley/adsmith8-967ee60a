
import mapboxgl from 'mapbox-gl';

/**
 * Adjusts map view based on container width
 */
export function adjustMapView(map: mapboxgl.Map, width: number) {
  console.log("Adjusting map view for container width:", width);
  
  // Set appropriate zoom level based on container width
  let zoom = 1.0;
  if (width >= 400 && width < 600) {
    zoom = 1.2;
  } else if (width >= 600 && width < 800) {
    zoom = 1.5;
  } else if (width >= 800) {
    zoom = 1.8;
  }
  
  // Apply the zoom level
  map.setZoom(zoom);
  
  // Define padding for better display
  const padding = {
    top: 10,
    bottom: 10,
    left: 20,
    right: 20
  };
  
  // Fit the map to show the entire world
  map.fitBounds([
    [-170, -56], // Southwest corner
    [170, 75]    // Northeast corner
  ], {
    padding,
    linear: true,
    duration: 0
  });
  
  console.log("Map view adjusted with zoom:", zoom);
}

/**
 * Forces the map to update its size and redraw
 * Useful after container size changes or when map doesn't render correctly
 */
export function forceMapUpdate(map: mapboxgl.Map) {
  if (!map) return;
  
  console.log("Forcing map update...");
  
  // Resize the map to fit its container
  map.resize();
  
  // Small shift to force rerender
  const center = map.getCenter();
  map.setCenter([center.lng + 0.0001, center.lat]);
  
  // Delayed shift back to original center
  setTimeout(() => {
    if (map) {
      map.setCenter(center);
      console.log("Map update complete");
    }
  }, 50);
}
