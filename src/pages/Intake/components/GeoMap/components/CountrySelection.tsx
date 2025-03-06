
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import CountryDropdown from "./CountryDropdown";
import { useCountries } from "../hooks/useCountries";

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

  // Effect for handling clicks outside of the dropdown
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

  // Effect to fetch and set the flag for the selected country
  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      const country = countries.find(c => c.country_id === selectedCountry);
      if (country) {
        setSelectedCountryFlag(country.country_flag);
      }
    } else {
      // Clear the flag when no country is selected
      setSelectedCountryFlag(null);
    }
  }, [selectedCountry, countries]);

  const handleCountrySelect = (country: string, flag?: string) => {
    console.log(`CountrySelection: Setting country to ${country}`);
    setSelectedCountry(country);
    if (flag) setSelectedCountryFlag(flag);
    setIsDropdownOpen(false);
    
    // Update map selection
    if (setSelectedCountryId) {
      console.log(`CountrySelection: Updating map with country ${country}`);
      setSelectedCountryId(country);
    }
  };

  return (
    <div className="mt-6" ref={dropdownRef}>
      <div className="font-bold text-lg mb-4">Country</div>
      
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="flex items-center gap-2 text-left truncate">
            {selectedCountryFlag && (
              <span className="inline-block w-6 text-center">{selectedCountryFlag}</span>
            )}
            <span>{countryName ? countryName : "Select a country"}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
        
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
