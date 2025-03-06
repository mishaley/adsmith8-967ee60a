
import { useCountrySelectionState } from './highlighting/useCountrySelectionState';
import { useClearCountrySelection } from './highlighting/useClearCountrySelection';
import { useClearExcludedCountry } from './highlighting/useClearExcludedCountry';
import { useRetryHighlight } from './highlighting/useRetryHighlight';
import { useHighlightAllCountries } from './highlighting/useHighlightAllCountries';
import { useHighlightCountry } from './highlighting/useHighlightCountry';
import mapboxgl from 'mapbox-gl';

interface UseDirectCountryHighlightingProps {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  initialized: boolean;
}

export const useDirectCountryHighlighting = ({
  map,
  initialized
}: UseDirectCountryHighlightingProps) => {
  // State management hook
  const {
    selectedCountryId,
    setSelectedCountryId,
    excludedCountryId,
    setExcludedCountryId
  } = useCountrySelectionState();

  // Clear selection hook
  const { clearCountrySelection } = useClearCountrySelection({
    map,
    initialized,
    selectedCountryId,
    setSelectedCountryId
  });

  // Clear excluded hook
  const { clearExcludedCountry } = useClearExcludedCountry({
    map,
    initialized,
    excludedCountryId,
    setExcludedCountryId
  });

  // Retry highlight hook
  const { retryHighlightWithFullScan } = useRetryHighlight({
    map,
    initialized
  });

  // Highlight all countries hook
  const { highlightAllCountries } = useHighlightAllCountries({
    map,
    initialized,
    clearCountrySelection,
    clearExcludedCountry,
    setSelectedCountryId
  });

  // Highlight country hook
  const { 
    highlightCountry, 
    highlightExcludedCountry 
  } = useHighlightCountry({
    map,
    initialized,
    clearCountrySelection,
    clearExcludedCountry,
    selectedCountryId,
    excludedCountryId,
    setSelectedCountryId,
    setExcludedCountryId,
    retryHighlightWithFullScan,
    highlightAllCountries
  });

  return {
    selectedCountryId,
    setSelectedCountryId,
    excludedCountryId,
    setExcludedCountryId,
    highlightCountry,
    highlightExcludedCountry,
    clearCountrySelection,
    clearExcludedCountry,
    highlightAllCountries
  };
};
