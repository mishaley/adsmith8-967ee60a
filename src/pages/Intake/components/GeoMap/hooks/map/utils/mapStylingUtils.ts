
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
  
  // Log all available layers for debugging
  console.log("Available layers:");
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
      // Log available sources and source-layers for debugging
      console.log("Available sources:", Object.keys(map.getStyle().sources || {}));
      
      // Primary approach: Use water layer edges if it exists
      if (map.getSource('composite') && map.getStyle().sources?.composite?.['source-layer']) {
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
      } else {
        console.log("Could not find suitable source for coastline layer");
      }
    } catch (error) {
      console.error("Error adding primary coastline layer:", error);
      
      // Fallback approach if primary fails
      try {
        map.addLayer({
          id: 'coastline-borders-fallback',
          type: 'line',
          source: 'composite',
          'source-layer': 'landuse', 
          filter: ['==', 'class', 'national_park'],
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
          },
          paint: {
            'line-color': '#c8c8c9',  // Match country border color
            'line-width': 0.8,        // Match default country border width
            'line-opacity': 1.0       // Full opacity
          }
        });
        console.log("Added fallback coastline layer");
      } catch (secondError) {
        console.error("Failed to add fallback coastline layer:", secondError);
      }
    }
  } else {
    console.log("Coastline layer already exists");
  }
}

/**
 * Updates water color and other styling on the map
 */
export function applyMapStyling(map: mapboxgl.Map) {
  console.log("Applying map styling...");
  
  // Update water color
  map.setPaintProperty('water', 'fill-color', '#e9f2fe');
  
  // Remove continent labels
  removeLabels(map);
  
  // Add coastline borders
  addCoastlineBorders(map);
  
  // Ensure country borders are visible by setting opacity
  try {
    if (map.getLayer('admin')) {
      map.setPaintProperty('admin', 'line-opacity', 1.0);
      console.log("Updated admin layer opacity");
    }
    if (map.getLayer('countries-border')) {
      map.setPaintProperty('countries-border', 'line-opacity', 1.0);
      console.log("Updated countries-border layer opacity");
    }
  } catch (e) {
    console.log("Could not update existing border layers:", e);
  }
  
  console.log("Map styling updated - removed labels and added coastlines");
}
