
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
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

  return (
    <div>
      <div className="font-bold text-lg mb-4">Country</div>
      
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="flex items-center gap-2 text-left truncate">
            {selectedCountryFlag && (
              <span className="inline-block w-6 text-center">{selectedCountryFlag}</span>
            )}
            <span>{displayName}</span>
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
            <div className="sticky bottom-0 w-full border-t border-gray-200 bg-white">
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-gray-500 flex items-center justify-center py-2"
                onClick={handleClearSelection}
                disabled={!selectedCountry}
              >
                <X className="h-4 w-4 mr-2" />
                Clear selection
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountrySelection;
