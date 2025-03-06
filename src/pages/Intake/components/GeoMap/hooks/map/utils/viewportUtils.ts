
import mapboxgl from 'mapbox-gl';

/**
 * Adjusts map view based on container width
 */
export function adjustMapView(map: mapboxgl.Map, width: number) {
  console.log("Adjusting map view for container width:", width);
  
  let zoom = 0.6;
  if (width >= 400 && width < 600) {
    zoom = 0.7;
  } else if (width >= 600 && width < 800) {
    zoom = 0.8;
  } else if (width >= 800) {
    zoom = 0.9;
  }
  
  map.setZoom(zoom);
  
  const padding = {
    top: 5,
    bottom: 5,
    left: 10,
    right: 10
  };
  
  map.fitBounds([
    [-180, -56], // Southwest corner
    [180, 81]    // Northeast corner
  ], {
    padding,
    linear: true,
    duration: 0
  });
}
