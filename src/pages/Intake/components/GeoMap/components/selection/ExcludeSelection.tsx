
import React, { useEffect, useState } from "react";
import { useCountries } from "../../hooks/useCountries";
import SelectionHeader from "./SelectionHeader";
import { EnhancedDropdown, DropdownOption } from "@/components/ui/enhanced-dropdown";

interface ExcludeSelectionProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedCountryFlag: string | null;
  onClearSelection: () => void;
  setExcludedCountryId?: ((id: string) => void) | null;
  hideLabel?: boolean;
  multiSelect?: boolean;
  selectedCountries?: string[];
  setSelectedCountries?: ((countries: string[]) => void) | null;
}

const ExcludeSelection: React.FC<ExcludeSelectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedCountryFlag,
  onClearSelection,
  setExcludedCountryId,
  hideLabel = false,
  multiSelect = false,
  selectedCountries = [],
  setSelectedCountries = null
}) => {
  const { countries, isLoading } = useCountries();
  const [countryOptions, setCountryOptions] = useState<DropdownOption[]>([]);
  
  useEffect(() => {
    if (countries.length > 0) {
      // Create dropdown options from countries
      const options: DropdownOption[] = countries.map(country => ({
        id: country.country_id,
        label: country.country_name,
        icon: country.country_flag
      }));
      
      setCountryOptions(options);
    }
  }, [countries]);

  const handleCountrySelect = (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      onClearSelection();
      return;
    }
    
    if (multiSelect && setSelectedCountries) {
      // Update multi-select state
      setSelectedCountries(selectedIds);
      
      // Also update single-select for backward compatibility
      if (selectedIds.length > 0) {
        setSelectedCountry(selectedIds[0]);
      } else {
        setSelectedCountry("");
      }
    } else {
      // For single select, use the first selected item
      const countryId = selectedIds[0];
      setSelectedCountry(countryId);
    }
    
    // Also update excluded country on map if that function is available (only for first country)
    if (setExcludedCountryId && selectedIds.length > 0) {
      const countryId = selectedIds[0];
      
      // Get the country object for map highlighting
      const country = countries.find(c => c.country_id === countryId);
      if (country) {
        // We might need to convert UUID to ISO code first
        const iso = country.country_iso2 || country.country_iso3;
        if (iso) {
          console.log(`Highlighting excluded country on map: ${iso}`);
          setExcludedCountryId(iso);
        } else {
          setExcludedCountryId(countryId);
        }
      } else {
        setExcludedCountryId(countryId);
      }
    }
  };

  return (
    <div>
      {!hideLabel && <SelectionHeader title="Exclude" />}
      
      <EnhancedDropdown
        options={countryOptions}
        selectedItems={multiSelect && selectedCountries.length > 0 ? selectedCountries : (selectedCountry ? [selectedCountry] : [])}
        onSelectionChange={handleCountrySelect}
        placeholder="Select country to exclude"
        searchPlaceholder="Search countries to exclude..."
        disabled={isLoading}
        multiSelect={multiSelect}
      />
      
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">
          Loading countries...
        </div>
      )}
    </div>
  );
};

export default ExcludeSelection;
