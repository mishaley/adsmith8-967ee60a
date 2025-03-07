
import React, { useEffect, useState } from "react";
import { useCountries } from "../../hooks/useCountries";
import SelectionHeader from "./SelectionHeader";
import { EnhancedDropdown, DropdownOption } from "@/components/ui/enhanced-dropdown";

interface CountrySelectionProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  setSelectedCountryId?: ((id: string) => void) | null;
  countryName: string | null;
  onClearSelection: () => void;
  hideLabel?: boolean;
  multiSelect?: boolean;
  selectedCountries?: string[];
  setSelectedCountries?: ((countries: string[]) => void) | null;
}

const CountrySelection: React.FC<CountrySelectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  setSelectedCountryId,
  countryName,
  onClearSelection,
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
      const options: DropdownOption[] = [
        // Add worldwide option at the top
        {
          id: "worldwide",
          label: "Worldwide",
          icon: "🌐"
        },
        // Add all country options
        ...countries.map(country => ({
          id: country.country_id,
          label: country.country_name,
          icon: country.country_flag
        }))
      ];
      
      setCountryOptions(options);
    }
  }, [countries]);

  const handleCountrySelect = (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      onClearSelection();
      return;
    }
    
    // Update multi-select state if available
    if (multiSelect && setSelectedCountries) {
      setSelectedCountries(selectedIds);
      
      // Also update single select state with first country for backward compatibility
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
    
    // Also update the map selection when selecting from dropdown (using first country)
    if (setSelectedCountryId && selectedIds.length > 0) {
      const countryId = selectedIds[0];
      console.log(`CountrySelection: Updating map with country ${countryId}`);
      
      if (countryId === "worldwide") {
        setSelectedCountryId("worldwide");
        return;
      }
      
      // Get the country object for map highlighting
      const selectedCountry = countries.find(c => c.country_id === countryId);
      
      if (selectedCountry) {
        // Use ISO3 code for map highlighting as it matches the GeoJSON features better
        if (selectedCountry.country_iso3) {
          console.log(`Using ISO3 code for highlighting: ${selectedCountry.country_iso3}`);
          setSelectedCountryId(selectedCountry.country_iso3);
        } else if (selectedCountry.country_iso2) {
          console.log(`Using ISO2 code for highlighting: ${selectedCountry.country_iso2}`);
          setSelectedCountryId(selectedCountry.country_iso2);
        } else {
          console.log(`No ISO code found, using country_id: ${countryId}`);
          setSelectedCountryId(countryId);
        }
      } else {
        setSelectedCountryId(countryId);
      }
    }
  };

  return (
    <div>
      {!hideLabel && <SelectionHeader title="Country" />}
      
      <EnhancedDropdown
        options={countryOptions}
        selectedItems={multiSelect && selectedCountries.length > 0 ? selectedCountries : (selectedCountry ? [selectedCountry] : [])}
        onSelectionChange={handleCountrySelect}
        placeholder="Select country"
        searchPlaceholder="Search countries..."
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

export default CountrySelection;
