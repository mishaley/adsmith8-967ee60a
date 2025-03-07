
import mapboxgl from 'mapbox-gl';

/**
 * Removes continent and country labels from the map
 */
export function removeLabels(map: mapboxgl.Map) {
  // Find and hide all continent, country, and ocean labels
  const labelsToHide = [
    'continent-label',
    'country-label',
    'state-label',
    'water-point-label',
    'water-line-label',
    'water-polygon-label',
    'marine-label',
    'sea-label',
    'ocean-label'
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
      map.once('style.load', () => {
        addCoastlineBorders(map);
      });
      return;
    }
    
    // Add multiple coastline layers to ensure they're visible
    // Try different approaches to find one that works
    console.log("Adding enhanced coastline borders");

    // Add coastline as a standalone layer using countries geojson
    if (map.getSource('countries-geojson')) {
      try {
        // Remove existing coastline layers to prevent duplicates
        if (map.getLayer('coastline-primary')) map.removeLayer('coastline-primary');
        
        // Add a more prominent coastline using countries geojson
        map.addLayer({
          id: 'coastline-primary',
          type: 'line',
          source: 'countries-geojson',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
          },
          paint: {
            'line-color': '#6e7377', // Darker color for better visibility
            'line-width': 1.2,
            'line-opacity': 0.9
          }
        });
        console.log("Added primary coastline layer from geojson");
      } catch (error) {
        console.error("Error adding primary coastline layer:", error);
      }
    }
    
    // Try adding coastlines from the built-in mapbox sources as a backup
    try {
      if (map.getLayer('coastline-backup')) map.removeLayer('coastline-backup');
      
      // Try using the land-structure layer from mapbox
      if (map.getSource('composite')) {
        map.addLayer({
          id: 'coastline-backup',
          type: 'line',
          source: 'composite',
          'source-layer': 'land',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
          },
          paint: {
            'line-color': '#6e7377',
            'line-width': 1.2,
            'line-opacity': 0.9
          }
        });
        console.log("Added backup coastline from composite source");
      }
    } catch (error) {
      console.log("Could not add backup coastline:", error);
    }
    
    // Add a third attempt using the water layer
    try {
      if (map.getLayer('coastline-water-edge')) map.removeLayer('coastline-water-edge');
      
      if (map.getSource('composite')) {
        map.addLayer({
          id: 'coastline-water-edge',
          type: 'line',
          source: 'composite',
          'source-layer': 'water',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
          },
          paint: {
            'line-color': '#6e7377',
            'line-width': 1.2,
            'line-opacity': 0.9
          }
        });
        console.log("Added water edge coastline");
      }
    } catch (error) {
      console.log("Could not add water edge coastline:", error);
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
    
    // Add coastline borders with enhanced visibility
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
