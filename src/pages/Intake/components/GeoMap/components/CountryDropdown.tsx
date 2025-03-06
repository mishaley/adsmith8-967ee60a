
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCountries } from "../hooks/useCountries";
import { Search, X } from "lucide-react";

interface CountryDropdownProps {
  selectedCountry: string;
  setSelectedCountry: (country: string, flag?: string) => void;
  setSelectedCountryId?: ((id: string) => void) | null;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  selectedCountry,
  setSelectedCountry,
  setSelectedCountryId
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { countries, isLoading } = useCountries();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the search input when the dropdown is opened
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.country_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle country selection
  const handleCountrySelect = (countryId: string, flag: string) => {
    console.log(`CountryDropdown: Selected country ${countryId}`);
    setSelectedCountry(countryId, flag);
    
    // Also highlight on map if the function is available
    if (setSelectedCountryId) {
      console.log(`CountryDropdown: Triggering map highlight for ${countryId}`);
      setSelectedCountryId(countryId);
    }
  };

  // Clear search term
  const clearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-8 w-full"
            autoComplete="off"
          />
          {searchTerm && (
            <button 
              className="absolute right-2 top-2.5"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading countries...</div>
      ) : filteredCountries.length > 0 ? (
        <div className="max-h-60 overflow-y-auto">
          {filteredCountries.map(country => (
            <Button 
              key={country.country_id} 
              type="button" 
              variant="ghost" 
              className={`w-full flex items-center justify-between px-4 py-2 text-left h-auto ${
                selectedCountry === country.country_id ? "bg-gray-100" : ""
              }`} 
              onClick={() => handleCountrySelect(country.country_id, country.country_flag)}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-6 text-center">{country.country_flag}</span>
                <span className="truncate">{country.country_name}</span>
              </div>
            </Button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">No countries found</div>
      )}
    </div>
  );
};

export default CountryDropdown;
