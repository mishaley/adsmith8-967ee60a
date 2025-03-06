
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
          'line-color': '#8ebdc2',
          'line-width': 1.0,
          'line-opacity': 0.9
        }
      });
      console.log("Added primary coastline layer");
    } catch (error) {
      console.error("Error adding primary coastline layer:", error);
      
      // Fallback approach using ocean layer if available
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
            'line-color': '#8ebdc2',
            'line-width': 1.0,
            'line-opacity': 0.9
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
    if (map.getLayer('countries-border')) {
      map.setPaintProperty('countries-border', 'line-opacity', 1.0);
      console.log("Updated existing country borders opacity");
    }
  } catch (e) {
    console.log("No countries-border layer found to update");
  }
  
  console.log("Map styling updated - removed labels and added coastlines");
}
