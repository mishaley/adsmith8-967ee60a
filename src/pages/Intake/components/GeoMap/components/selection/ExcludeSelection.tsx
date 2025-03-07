
import React, { useState } from "react";
import CountryDropdown from "../CountryDropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SelectionHeader from "./SelectionHeader";
import SelectionButton from "./SelectionButton";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { countries } = useCountries();

  const handleCountrySelect = (country: string, flag?: string) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Get the country name from the selected country ID
  const displayName = countries.find(c => c.country_id === selectedCountry)?.country_name || "";

  return (
    <div>
      {!hideLabel && <SelectionHeader title="Exclude" />}
      
      <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <PopoverTrigger asChild>
          <SelectionButton 
            onClick={toggleDropdown}
            selectedFlag={selectedCountryFlag}
            displayName={displayName}
          />
        </PopoverTrigger>
        
        <PopoverContent 
          align="center" 
          side="top" 
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white rounded-md shadow-lg border-gray-100 z-50"
          style={{ 
            border: '1px solid #f1f1f1',
            maxHeight: '300px',
            overflowY: 'visible'
          }}
          sideOffset={5}
        >
          <div className="max-h-80 overflow-visible">
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

// Add the missing useCountries import
import { useCountries } from "../../hooks/useCountries";

export default ExcludeSelection;
