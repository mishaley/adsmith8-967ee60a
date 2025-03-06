
import mapboxgl from 'mapbox-gl';
import { addCountrySource } from './layers/useCountrySource';
import { addCountryFillLayer } from './layers/useCountryFillLayer';
import { addCountryBorderLayer } from './layers/useCountryBorderLayer';
import { setupHoverEvents } from './layers/useCountryHover';
import { setupClickEvents } from './layers/useCountryClickEvents';
import { highlightCountry } from './layers/useCountryHighlight';
import { addCoastlineLayer } from './layers/useCoastlineLayer';

// Re-export all layer functions
export {
  addCountrySource,
  addCountryFillLayer,
  addCountryBorderLayer,
  setupHoverEvents,
  setupClickEvents,
  highlightCountry,
  addCoastlineLayer
};
