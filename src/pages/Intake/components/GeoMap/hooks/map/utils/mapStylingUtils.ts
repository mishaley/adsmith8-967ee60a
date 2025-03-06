
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
    // Check if coastline layer exists in mapbox style
    if (map.getSource('composite')) {
      console.log("Adding coastline border layer");
      
      // Add coastline layer from mapbox composite source
      map.addLayer({
        id: 'coastline-borders',
        type: 'line',
        source: 'composite',
        'source-layer': 'landuse', // For coastlines
        filter: ['==', 'class', 'national_park'], // Use national_park edges as a proxy for coastlines
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#8ebdc2',
          'line-width': 0.5,
          'line-opacity': 0.6
        }
      });
    } else {
      // Add coastline using water layer edge
      console.log("Adding coastline using water edge");
      
      // Add a line layer that traces the edge of water polygons
      map.addLayer({
        id: 'coastline-borders',
        type: 'line',
        source: 'composite',
        'source-layer': 'water',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#8ebdc2',
          'line-width': 0.5, 
          'line-opacity': 0.6
        }
      });
    }
  } else {
    console.log("Coastline layer already exists");
  }
}

/**
 * Updates water color and other styling on the map
 */
export function applyMapStyling(map: mapboxgl.Map) {
  // Update water color
  map.setPaintProperty('water', 'fill-color', '#e9f2fe');
  
  // Remove continent labels
  removeLabels(map);
  
  // Add coastline borders
  addCoastlineBorders(map);
  
  console.log("Map styling updated - removed labels and added coastlines");
}
