
import mapboxgl from 'mapbox-gl';

/**
 * Removes continent and country labels from the map
 */
export function removeLabels(map: mapboxgl.Map) {
  // Find and hide all continent and large region labels
  const labelsToHide = [
    'continent-label',
    'country-label',
    'state-label'
  ];
  
  labelsToHide.forEach(layerId => {
    try {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'none');
        console.log(`Hidden layer: ${layerId}`);
      }
    } catch (error) {
      console.log(`Could not hide layer ${layerId}:`, error);
    }
  });
}

/**
 * Adds coastline borders to the map
 */
export function addCoastlineBorders(map: mapboxgl.Map) {
  try {
    // Check if map and style are properly loaded
    if (!map.isStyleLoaded()) {
      console.log("Style not loaded, deferring coastline border addition");
      return;
    }
    
    // Log all available layers for debugging
    console.log("Available layers for coastlines:");
    const layers = map.getStyle().layers || [];
    const sources = Object.keys(map.getStyle().sources || {});
    console.log("Available sources:", sources);
    
    layers.forEach(layer => {
      if (layer.id.includes('water') || layer.id.includes('land') || layer.id.includes('coast')) {
        console.log(`Potential coastline layer: ${layer.id}`);
      }
    });
    
    // Attempt to add coastline layer
    if (!map.getLayer('coastline-borders')) {
      console.log("Adding coastline-borders layer");
      
      // Use a more reliable approach with water layer if available
      if (map.getSource('composite')) {
        try {
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
              'line-color': '#c8c8c9',
              'line-width': 0.8,
              'line-opacity': 1.0
            }
          });
          console.log("Added coastline-borders layer with water source-layer");
        } catch (error) {
          console.error("Error adding coastline-borders with water:", error);
          
          // Fallback to admin boundaries if available
          try {
            map.addLayer({
              id: 'coastline-borders-fallback',
              type: 'line',
              source: 'composite',
              'source-layer': 'admin',
              filter: ['==', 'admin_level', 0],
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
                'visibility': 'visible'
              },
              paint: {
                'line-color': '#c8c8c9',
                'line-width': 0.8,
                'line-opacity': 1.0
              }
            });
            console.log("Added fallback coastline layer with admin source-layer");
          } catch (fallbackError) {
            console.error("Error adding fallback coastline layer:", fallbackError);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in addCoastlineBorders:", error);
  }
}

/**
 * Updates water color and other styling on the map
 */
export function applyMapStyling(map: mapboxgl.Map) {
  console.log("Applying map styling...");
  
  try {
    // Wait until the style is fully loaded
    if (!map.isStyleLoaded()) {
      console.log("Style not loaded yet, setting up event listener");
      map.once('style.load', () => {
        console.log("Style now loaded, applying styling");
        applyMapStylingInternal(map);
      });
      return;
    }
    
    applyMapStylingInternal(map);
  } catch (error) {
    console.error("Error in applyMapStyling:", error);
  }
}

/**
 * Internal function to apply styling once style is loaded
 */
function applyMapStylingInternal(map: mapboxgl.Map) {
  try {
    // Update water color
    if (map.getLayer('water')) {
      map.setPaintProperty('water', 'fill-color', '#e9f2fe');
      console.log("Updated water color");
    }
    
    // Remove labels
    removeLabels(map);
    
    // Add coastline borders
    addCoastlineBorders(map);
    
    // Make sure admin boundaries are visible
    try {
      const adminLayers = map.getStyle().layers?.filter(l => 
        l.id.includes('admin') || l.id.includes('border') || l.id.includes('boundaries')
      ) || [];
      
      adminLayers.forEach(layer => {
        console.log(`Found admin layer: ${layer.id}`);
        try {
          map.setPaintProperty(layer.id, 'line-opacity', 1.0);
          map.setPaintProperty(layer.id, 'line-width', 0.8);
        } catch (e) {
          // Ignore errors for individual layers
        }
      });
      
      console.log("Updated admin layer properties");
    } catch (e) {
      console.log("Could not update admin layers:", e);
    }
    
    console.log("Map styling applied successfully");
  } catch (error) {
    console.error("Error applying internal map styling:", error);
  }
}
