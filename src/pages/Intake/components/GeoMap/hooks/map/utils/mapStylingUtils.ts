
import mapboxgl from 'mapbox-gl';

/**
 * Removes continent and country labels from the map
 */
export function removeLabels(map: mapboxgl.Map) {
  // Find and hide all continent and large region labels
  const labelsToHide = [
    'continent-label',
    'country-label'
  ];
  
  labelsToHide.forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', 'none');
      console.log(`Hidden layer: ${layerId}`);
    } else {
      console.log(`Layer not found: ${layerId}`);
    }
  });
  
  // Find all layers with names containing "label" and log them for debugging
  map.getStyle().layers?.forEach((layer) => {
    if (layer.id.includes('label')) {
      console.log(`Found label layer: ${layer.id}`);
    }
  });
}

/**
 * Updates water color and other styling on the map
 */
export function applyMapStyling(map: mapboxgl.Map) {
  // Update water color
  map.setPaintProperty('water', 'fill-color', '#e9f2fe');
  
  // Remove continent labels
  removeLabels(map);
  
  console.log("Map styling updated - removed continent labels");
}
