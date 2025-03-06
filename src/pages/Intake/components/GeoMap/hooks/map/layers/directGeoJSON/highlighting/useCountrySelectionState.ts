
import { useState } from 'react';

/**
 * Hook to manage the state of country selection and exclusion
 */
export const useCountrySelectionState = () => {
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [excludedCountryId, setExcludedCountryId] = useState<string | null>(null);

  return {
    selectedCountryId,
    setSelectedCountryId,
    excludedCountryId,
    setExcludedCountryId
  };
};
