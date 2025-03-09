
import React, { useEffect, useState } from "react";
import { useCountries } from "../../hooks/useCountries";
import SelectionHeader from "./SelectionHeader";
import { EnhancedDropdown, DropdownOption } from "@/components/ui/enhanced-dropdown";

interface ExcludeSelectionProps {
  excludedCountries: string[];
  setExcludedCountries: (countries: string[]) => void;
  setExcludedCountryId?: ((id: string) => void) | null;
  hideLabel?: boolean;
}

const ExcludeSelection: React.FC<ExcludeSelectionProps> = ({
  excludedCountries,
  setExcludedCountries,
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
    // Update the excluded countries list
    setExcludedCountries(selectedIds);
    
    // For map highlighting, use the first country (if available)
    if (setExcludedCountryId) {
      if (selectedIds.length > 0) {
        const firstCountryId = selectedIds[0];
        const country = countries.find(c => c.country_id === firstCountryId);
        
        if (country) {
          // Use ISO code for map if available
          const iso = country.country_iso2 || country.country_iso3;
          if (iso) {
            console.log(`Highlighting excluded country on map: ${iso}`);
            setExcludedCountryId(iso);
          } else {
            setExcludedCountryId(firstCountryId);
          }
        } else {
          setExcludedCountryId(firstCountryId);
        }
      } else {
        // Clear excluded country highlight if no countries selected
        setExcludedCountryId("");
      }
    }
  };

  return (
    <div>
      {!hideLabel && <SelectionHeader title="Exclude" />}
      
      <EnhancedDropdown
        options={countryOptions}
        selectedItems={excludedCountries}
        onSelectionChange={handleCountrySelect}
        placeholder=""
        searchPlaceholder="Search countries to exclude..."
        disabled={isLoading}
        multiSelect={true}
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
