
import mapboxgl from 'mapbox-gl';
import { 
  addCountrySource, 
  addCountryFillLayer, 
  addCountryBorderLayer,
  setupHoverEvents,
  setupClickEvents,
  highlightCountry
} from './layers';

interface UseCountryLayersProps {
  map: mapboxgl.Map;
  onCountryClick: (countryId: string) => void;
}

export const useCountryLayers = ({
  map,
  onCountryClick
}: UseCountryLayersProps) => {
  // Initialize everything
  addCountrySource(map);
  addCountryFillLayer(map);
  addCountryBorderLayer(map);
  setupHoverEvents(map);
  setupClickEvents(map, onCountryClick);

  // Return methods that can be used by the parent component
  return {
    highlightCountry: (countryId: string) => highlightCountry(map, countryId)
  };
};
