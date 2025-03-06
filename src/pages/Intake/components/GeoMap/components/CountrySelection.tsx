
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import CountryDropdown from "./CountryDropdown";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Selected country object
  const selectedCountryObject = selectedCountry ? { country_id: selectedCountry, country_name: countryName } : null;

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

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    if (setSelectedCountryId) {
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
            {selectedCountryObject ? selectedCountryObject.country_name : "Select a country"}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
        
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="max-h-60 overflow-auto">
              <CountryDropdown 
                selectedCountry={selectedCountry} 
                setSelectedCountry={handleCountrySelect}
                setSelectedCountryId={null}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountrySelection;
