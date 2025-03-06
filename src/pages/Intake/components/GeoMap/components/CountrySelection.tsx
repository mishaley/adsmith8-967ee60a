
import React, { useState, useRef, useEffect } from "react";
import CountryDropdown from "./CountryDropdown";
import { useCountries } from "../hooks/useCountries";
import SelectionHeader from "./selection/SelectionHeader";
import SelectionButton from "./selection/SelectionButton";

interface CountrySelectionProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  setSelectedCountryId?: ((id: string) => void) | null;
  countryName: string | null;
}

const CountrySelection: React.FC<CountrySelectionProps> = ({
  selectedCountry,
  setSelectedCountry,
  setSelectedCountryId,
  countryName
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountryFlag, setSelectedCountryFlag] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { countries } = useCountries();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (selectedCountry && selectedCountry === "worldwide") {
      setSelectedCountryFlag("🌐");
    } else if (selectedCountry && countries.length > 0) {
      const country = countries.find(c => c.country_id === selectedCountry);
      if (country) {
        setSelectedCountryFlag(country.country_flag);
        console.log(`CountrySelection: Updated flag for ${country.country_name}: ${country.country_flag}`);
      } else {
        console.log(`CountrySelection: No country found with ID ${selectedCountry}`);
      }
    } else {
      setSelectedCountryFlag(null);
    }
  }, [selectedCountry, countries]);

  const handleCountrySelect = (country: string, flag?: string) => {
    console.log(`CountrySelection: Setting country to ${country}`);
    setSelectedCountry(country);
    if (flag) setSelectedCountryFlag(flag);
    setIsDropdownOpen(false);
    
    // Also update the map selection when selecting from dropdown
    if (setSelectedCountryId) {
      console.log(`CountrySelection: Updating map with country ${country}`);
      setSelectedCountryId(country);
    }
  };

  const handleClearSelection = () => {
    console.log("CountrySelection: Clearing selection");
    setSelectedCountry("");
    setSelectedCountryFlag(null);
    
    // Also clear the map selection
    if (setSelectedCountryId) {
      setSelectedCountryId("");
    }
    
    // Close the dropdown
    setIsDropdownOpen(false);
  };

  // Display name for the worldwide option
  const displayName = selectedCountry === "worldwide" ? "Worldwide" : countryName || "";

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div>
      <SelectionHeader title="Country" />
      
      <div className="relative" ref={dropdownRef}>
        <SelectionButton 
          onClick={toggleDropdown}
          selectedFlag={selectedCountryFlag}
          displayName={displayName}
        />
        
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="max-h-60 overflow-auto">
              <CountryDropdown 
                selectedCountry={selectedCountry} 
                setSelectedCountry={handleCountrySelect}
                setSelectedCountryId={setSelectedCountryId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountrySelection;
