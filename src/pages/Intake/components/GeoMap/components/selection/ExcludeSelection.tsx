
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
}

const ExcludeSelection: React.FC<ExcludeSelectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedCountryFlag,
  onClearSelection,
  setExcludedCountryId,
  hideLabel = false
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
    
    const countryId = selectedIds[0];
    setSelectedCountry(countryId);
    
    // Also update excluded country on map if that function is available
    if (setExcludedCountryId) {
      setExcludedCountryId(countryId);
    }
  };

  return (
    <div>
      {!hideLabel && <SelectionHeader title="Exclude" />}
      
      <EnhancedDropdown
        options={countryOptions}
        selectedItems={selectedCountry ? [selectedCountry] : []}
        onSelectionChange={handleCountrySelect}
        placeholder="Select country to exclude"
        searchPlaceholder="Search countries to exclude..."
        disabled={isLoading}
        multiSelect={false}
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
