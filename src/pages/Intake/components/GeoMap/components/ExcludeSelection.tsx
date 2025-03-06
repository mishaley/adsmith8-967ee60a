
import React, { useState, useEffect } from "react";
import CountryDropdown from "./CountryDropdown";
import { useCountries } from "../hooks/useCountries";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SelectionHeader from "./selection/SelectionHeader";
import SelectionButton from "./selection/SelectionButton";

interface ExcludeSelectionProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countryName: string | null;
  setExcludedCountryId?: ((id: string) => void) | null;
}

const ExcludeSelection: React.FC<ExcludeSelectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  countryName,
  setExcludedCountryId
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState<string | null>(null);
  const { countries } = useCountries();

  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      const country = countries.find(c => c.country_id === selectedCountry);
      if (country) {
        setSelectedCountryFlag(country.country_flag);
        
        // Highlight the excluded country on the map if possible
        if (setExcludedCountryId) {
          // We might need to convert UUID to ISO code first
          const iso = country.country_iso2 || country.country_iso3;
          if (iso) {
            console.log(`Highlighting excluded country on map: ${iso}`);
            setExcludedCountryId(iso);
          }
        }
      }
    } else {
      setSelectedCountryFlag(null);
    }
  }, [selectedCountry, countries, setExcludedCountryId]);

  const handleCountrySelect = (country: string, flag?: string) => {
    setSelectedCountry(country);
    if (flag) setSelectedCountryFlag(flag);
    setIsDropdownOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedCountry("");
    setSelectedCountryFlag(null);
    
    // Clear excluded country on the map
    if (setExcludedCountryId) {
      setExcludedCountryId("");
    }
    
    setIsDropdownOpen(false); // Close the dropdown after clearing
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div>
      <SelectionHeader title="Exclude" />
      
      <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <PopoverTrigger asChild>
          <SelectionButton 
            onClick={toggleDropdown}
            selectedFlag={selectedCountryFlag}
            displayName={countryName || ""}
          />
        </PopoverTrigger>
        
        <PopoverContent 
          align="center" 
          side="top" 
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white rounded-md shadow-lg border-gray-100"
          style={{ border: '1px solid #f1f1f1' }}
        >
          <div className="max-h-60 overflow-auto">
            <CountryDropdown 
              selectedCountry={selectedCountry} 
              setSelectedCountry={handleCountrySelect}
              setSelectedCountryId={null}
              isExcludeDropdown={true}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ExcludeSelection;
