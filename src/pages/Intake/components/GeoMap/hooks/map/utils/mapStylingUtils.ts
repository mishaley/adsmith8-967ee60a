
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
 * Adds coastline borders to the map
 */
export function addCoastlineBorders(map: mapboxgl.Map) {
  if (!map.getLayer('coastline-borders')) {
    console.log("Adding coastline border layer");
    
    try {
      // Primary approach: Use water layer edges
      map.addLayer({
        id: 'coastline-borders',
        type: 'line',
        source: 'composite',
        'source-layer': 'water',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        paint: {
          'line-color': '#c8c8c9',  // Match the default country border color
          'line-width': 0.8,        // Match the default border width
          'line-opacity': 1.0       // Full opacity like country borders
        }
      });
      console.log("Added primary coastline layer");
    } catch (error) {
      console.error("Error adding primary coastline layer:", error);
    }
  } else {
    console.log("Coastline layer already exists");
  }
}

/**
 * Adds a basic world outline layer to ensure there's always something visible
 */
export function addWorldOutlineLayer(map: mapboxgl.Map) {
  if (!map.getLayer('world-outline')) {
    try {
      // Add a simple world outline as a fallback
      map.addLayer({
        id: 'world-outline',
        type: 'line',
        source: 'composite',
        'source-layer': 'land',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        paint: {
          'line-color': '#c8c8c9',
          'line-width': 1,
          'line-opacity': 0.8
        }
      });
      console.log("Added world outline layer");
    } catch (error) {
      console.error("Error adding world outline layer:", error);
    }
  }
}

/**
 * Updates water color and other styling on the map
 */
export function applyMapStyling(map: mapboxgl.Map) {
  console.log("Applying map styling...");
  
  try {
    // Update water color
    map.setPaintProperty('water', 'fill-color', '#e9f2fe');
    
    // Remove continent labels
    removeLabels(map);
    
    // Add coastline borders
    addCoastlineBorders(map);
    
    // Add world outline as a fallback
    addWorldOutlineLayer(map);
    
    // Note: Removed setBrightness call as it's not a valid method on mapboxgl.Map
    
    console.log("Map styling applied successfully");
  } catch (e) {
    console.error("Error applying map styling:", e);
  }
}
