
import mapboxgl from 'mapbox-gl';
import { 
  useCountrySource, 
  useCountryFillLayer, 
  useCountryBorderLayer,
  useCountryHover,
  useCountrySelection
} from './layers';

interface UseCountryLayersProps {
  map: mapboxgl.Map;
  onCountryClick: (countryId: string) => void;
}

export const useCountryLayers = ({
  map,
  onCountryClick
}: UseCountryLayersProps) => {
  // Import all functionality from the smaller hooks
  const { addCountrySource } = useCountrySource(map);
  const { addCountryFillLayer } = useCountryFillLayer(map);
  const { addCountryBorderLayer } = useCountryBorderLayer(map);
  const { setupHoverEvents } = useCountryHover(map);
  const { setupClickEvents, highlightCountry } = useCountrySelection(map, onCountryClick);

  // Initialize everything
  addCountrySource();
  addCountryFillLayer();
  addCountryBorderLayer();
  setupHoverEvents();
  setupClickEvents();

  // Return methods that can be used by the parent component
  return {
    highlightCountry
  };
};
