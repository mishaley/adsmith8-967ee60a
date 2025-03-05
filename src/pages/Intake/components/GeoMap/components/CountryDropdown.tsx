
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCountries } from "../hooks/useCountries";

interface CountryDropdownProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  selectedCountry,
  setSelectedCountry
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { countries, isLoading } = useCountries();

  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.country_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find the selected country object
  const selectedCountryObject = countries.find(country => country.country_id === selectedCountry);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="font-bold text-lg mb-4">Country</div>
      
      <div className="relative">
        <Input 
          type="text" 
          placeholder="Search countries..." 
          value={searchTerm} 
          onChange={handleInputChange} 
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
        
        {selectedCountryObject && searchTerm === "" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-gray-700 pointer-events-none">
            <span>{selectedCountryObject.country_flag}</span>
            <span>{selectedCountryObject.country_name}</span>
          </div>
        )}
        
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
            {isLoading ? (
              <div className="p-2 text-center">Loading countries...</div>
            ) : filteredCountries.length > 0 ? (
              filteredCountries.map(country => (
                <Button 
                  key={country.country_id} 
                  type="button" 
                  variant="ghost" 
                  className={`w-full flex items-center justify-between px-4 py-2 text-left ${selectedCountry === country.country_id ? "bg-gray-100" : ""}`} 
                  onClick={() => {
                    setSelectedCountry(country.country_id);
                    setSearchTerm("");
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{country.country_flag}</span>
                    <span>{country.country_name}</span>
                  </div>
                </Button>
              ))
            ) : (
              <div className="p-2 text-center">No countries found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDropdown;
