
import mapboxgl from 'mapbox-gl';

/**
 * Calculates a bounding box for a feature's geometry
 * @param feature The GeoJSON feature to calculate the bounding box for
 * @returns A mapboxgl.LngLatBounds object representing the bounding box
 */
export const calculateFeatureBbox = (feature: GeoJSON.Feature): mapboxgl.LngLatBounds => {
  const bbox = new mapboxgl.LngLatBounds();
  
  if (feature.geometry.type === 'Polygon') {
    (feature.geometry.coordinates[0] as [number, number][]).forEach(coord => {
      bbox.extend(coord as mapboxgl.LngLatLike);
    });
  } else if (feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates.forEach(polygon => {
      (polygon[0] as [number, number][]).forEach(coord => {
        bbox.extend(coord as mapboxgl.LngLatLike);
      });
    });
  }
  
  return bbox;
};
