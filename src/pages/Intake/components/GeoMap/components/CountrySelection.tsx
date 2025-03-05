
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");
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
        setSearchTerm("");
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
        {/* If a country is selected, show the selection instead of the search input */}
        {selectedCountryObject && !isDropdownOpen ? (
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
            onClick={() => setIsDropdownOpen(true)}
          >
            <span className="flex items-center gap-2 text-left">
              {selectedCountryObject.country_name}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        ) : (
          <Input 
            type="text" 
            placeholder="Search countries..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            onFocus={() => setIsDropdownOpen(true)} 
            onClick={() => setIsDropdownOpen(true)} 
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsDropdownOpen(false);
              }
            }}
            autoComplete="off" 
            className="w-full" 
          />
        )}
        
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-left text-gray-500 border-b" 
              onClick={() => {
                setIsDropdownOpen(false);
                setSearchTerm("");
              }}
            >
              Close
            </Button>
            
            <CountryDropdown 
              selectedCountry={selectedCountry} 
              setSelectedCountry={handleCountrySelect}
              setSelectedCountryId={null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CountrySelection;
